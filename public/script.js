const socket = io();

const joinBtn = document.getElementById('joinBtn');
const roomInput = document.getElementById('roomId');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let localStream;
let peerConnection;
let roomId;

const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};

async function initLocalMedia() {
  if (localStream) return localStream;
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;
  return localStream;
}

function createPeer() {
  if (peerConnection) return peerConnection;
  peerConnection = new RTCPeerConnection(rtcConfig);

  peerConnection.ontrack = (event) => {
    if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== event.streams[0].id) {
      remoteVideo.srcObject = event.streams[0];
    }
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('signal', { roomId, data: { type: 'ice-candidate', candidate: event.candidate } });
    }
  };

  localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
  return peerConnection;
}

async function createAndSendOffer() {
  const pc = createPeer();
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.emit('signal', { roomId, data: { type: 'offer', sdp: offer } });
}

async function handleOffer(sdp, from) {
  const pc = createPeer();
  await pc.setRemoteDescription(new RTCSessionDescription(sdp));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  socket.emit('signal', { roomId, to: from, data: { type: 'answer', sdp: answer } });
}

async function handleAnswer(sdp) {
  if (!peerConnection) return;
  await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
}

async function handleIceCandidate(candidate) {
  if (!peerConnection) return;
  try {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (e) {
    console.error('Failed to add ICE candidate', e);
  }
}

joinBtn.addEventListener('click', async () => {
  roomId = (roomInput.value || '').trim();
  if (!roomId) {
    alert('Enter a room ID');
    return;
  }

  await initLocalMedia();
  socket.emit('join', roomId);
});

socket.on('user-joined', async () => {
  await initLocalMedia();
  await createAndSendOffer();
});

socket.on('signal', async ({ from, data }) => {
  if (data.type === 'offer') {
    await initLocalMedia();
    await handleOffer(data.sdp, from);
  } else if (data.type === 'answer') {
    await handleAnswer(data.sdp);
  } else if (data.type === 'ice-candidate') {
    await handleIceCandidate(data.candidate);
  }
});

socket.on('user-left', () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (remoteVideo.srcObject) {
    remoteVideo.srcObject.getTracks().forEach((t) => t.stop());
    remoteVideo.srcObject = null;
  }
});


