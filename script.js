
const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const originalImg = document.getElementById("original-image");
const originalSizeText = document.getElementById("original-size");
const compressedSizeText = document.getElementById("compressed-size");
const compressionPercent = document.getElementById("compression-percent");
const compressionMeter = document.getElementById("compression-meter");
const previewSection = document.getElementById("preview-section");
const downloadBtn = document.getElementById("download");

upload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      originalImg.src = event.target.result;
      const originalKB = (file.size / 1024).toFixed(2);
      originalSizeText.textContent = `Size: ${originalKB} KB`;

      ctx.drawImage(img, 0, 0, img.width, img.height);
      const quality = 0.6;
      canvas.toBlob(
        (blob) => {
          const compressedKB = (blob.size / 1024).toFixed(2);
          compressedSizeText.textContent = `Size: ${compressedKB} KB`;

          const percent = 100 - ((blob.size / file.size) * 100).toFixed(2);
          compressionMeter.style.width = percent + "%";
          compressionPercent.textContent = `Compressed by ${percent}%`;

          downloadBtn.onclick = () => {
            const link = document.createElement("a");
            link.download = "compressed-image.jpg";
            link.href = URL.createObjectURL(blob);
            link.click();
          };
        },
        "image/jpeg",
        quality
      );
    };
    img.src = event.target.result;
    previewSection.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});
