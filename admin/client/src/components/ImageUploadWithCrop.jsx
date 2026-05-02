import { useEffect, useRef, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slider, Stack, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const ImageUploadWithCrop = ({ initialImage, onFileChange, label = 'Photo' }) => {
  const [source, setSource] = useState(initialImage || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialImage || '');
  const [cropSize, setCropSize] = useState(80);
  const [cropX, setCropX] = useState(10);
  const [cropY, setCropY] = useState(10);
  const [cropReady, setCropReady] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const cleanupUrl = useRef(null);

  useEffect(() => {
    setSource(initialImage || '');
    setPreviewUrl(initialImage || '');
    setCropReady(false);
    setSelectedFile(null);
  }, [initialImage]);

  useEffect(() => {
    if (!selectedFile && !source) {
      onFileChange(null);
    }
  }, [selectedFile, source, onFileChange]);

  useEffect(() => {
    return () => {
      if (cleanupUrl.current) {
        URL.revokeObjectURL(cleanupUrl.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  const loadFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSource(reader.result);
      setPreviewUrl(reader.result);
      setCropSize(80);
      setCropX(10);
      setCropY(10);
      setSelectedFile(file);
      setCropReady(true);
      onFileChange(file);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      loadFile(file);
    }
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access failed', error);
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setCameraOpen(false);
  };

  const captureFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const cameraFile = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        loadFile(cameraFile);
        closeCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleCrop = () => {
    if (!source || !selectedFile) return;

    const img = new Image();
    img.src = source;
    img.onload = () => {
      const cropWidth = Math.floor(img.width * (cropSize / 100));
      const cropHeight = Math.floor(img.height * (cropSize / 100));
      const x = Math.floor((img.width - cropWidth) * (cropX / 100));
      const y = Math.floor((img.height - cropHeight) * (cropY / 100));

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, x, y, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], selectedFile.name || 'photo.jpg', { type: 'image/jpeg' });
          if (cleanupUrl.current) {
            URL.revokeObjectURL(cleanupUrl.current);
          }
          const croppedUrl = URL.createObjectURL(blob);
          cleanupUrl.current = croppedUrl;
          setSelectedFile(croppedFile);
          setPreviewUrl(croppedUrl);
          onFileChange(croppedFile);
        }
      }, 'image/jpeg', 0.9);
    };
  };

  return (
    <Box sx={{ display: 'grid', gap: 2, py: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Button variant="outlined" component="label" startIcon={<PhotoCameraIcon />}>
          Choose Image
          <input hidden accept="image/*" type="file" onChange={handleFileChange} />
        </Button>
        <Button variant="outlined" startIcon={<CameraAltIcon />} onClick={openCamera}>
          Open Camera
        </Button>
      </Stack>

      {previewUrl ? (
        <Box sx={{ display: 'grid', gap: 1 }}>
          <Box component="img" src={previewUrl} alt="Preview" sx={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }} />
          {cropReady && (
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>Crop size</Typography>
                <Slider value={cropSize} min={40} max={100} onChange={(event, value) => setCropSize(value)} sx={{ flex: 1 }} />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>X</Typography>
                <Slider value={cropX} min={0} max={100} onChange={(event, value) => setCropX(value)} sx={{ flex: 1 }} />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>Y</Typography>
                <Slider value={cropY} min={0} max={100} onChange={(event, value) => setCropY(value)} sx={{ flex: 1 }} />
              </Stack>
              <Button variant="contained" onClick={handleCrop}>
                Crop Image
              </Button>
            </Stack>
          )}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Upload a photo or use the camera to capture one. Then use the crop controls to adjust the frame.
        </Typography>
      )}

      <Dialog open={cameraOpen} onClose={closeCamera} fullWidth maxWidth="sm">
        <DialogTitle>Camera Capture</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', aspectRatio: '4 / 3', borderRadius: 2, overflow: 'hidden', bgcolor: '#000' }}>
            <Box component="video" ref={videoRef} autoPlay playsInline muted sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCamera}>Cancel</Button>
          <Button variant="contained" onClick={captureFromCamera}>
            Capture
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageUploadWithCrop;
