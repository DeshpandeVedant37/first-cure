function previewImage() {
  const file = imageUpload.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    preview.src = e.target.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
}

let map = null;

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        map = L.map('map').setView([lat, lng], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);
        
        L.marker([lat, lng]).addTo(map)
          .bindPopup('Your Location').openPopup();
        
        // Sample dermatologist locations (replace with real data)
        const dermatologists = [
          { lat: lat + 0.01, lng: lng + 0.01, name: 'Skin Care Clinic', address: '123 Medical Ave' },
          { lat: lat - 0.015, lng: lng + 0.02, name: 'Dermatology Center', address: '456 Health St' },
          { lat: lat + 0.02, lng: lng - 0.01, name: 'Advanced Skin Institute', address: '789 Care Blvd' }
        ];
        
        dermatologists.forEach(doc => {
          L.marker([doc.lat, doc.lng], {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41]
            })
          }).addTo(map)
            .bindPopup(`<b>${doc.name}</b><br>${doc.address}`);
        });
      },
      () => {
        // Default location if geolocation fails
        map = L.map('map').setView([40.7128, -74.0060], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);
      }
    );
  }
}

async function analyzeImage() {
  if (!imageUpload.files.length) return;

  scanner.style.display = "block";
  statusText.innerText = "🧠 AI analyzing skin tissue…";
  progressFill.style.width = "0%";

  const formData = new FormData();
  formData.append("image", imageUpload.files[0]);

  const res = await fetch("/predict", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  scanner.style.display = "none";

  const confidence = Math.round(data.confidence * 100);
  progressFill.style.width = confidence + "%";
  const reportCard = document.querySelector('.report-card');

  if (data.prediction === "cancer") {
    statusText.innerText = "⚠️ CANCEROUS";
    statusText.style.color = "#c92a2a";
    recommendation.innerText = "Immediate consultation with a dermatologist is advised.";
    recommendation.style.color = "#c92a2a";
    reportCard.style.borderLeft = "5px solid #c92a2a";
  } else {
    statusText.innerText = "✅ NON-CANCEROUS";
    statusText.style.color = "#2b8a3e";
    recommendation.innerText = "No critical indicators found. Continue monitoring.";
    recommendation.style.color = "#2b8a3e";
    reportCard.style.borderLeft = "5px solid #2b8a3e";
  }

  document.querySelector('.map-section').style.display = 'block';
  if (!map) {
    setTimeout(() => initMap(), 100);
  }
}