#!/bin/bash
# บีบอัดวิดีโอให้ขนาดเล็กลงด้วย ffmpeg
# ใช้ H.264 CRF 28 - คุณภาพดี ขนาดเล็กลงมาก (เหมาะกับ web)

set -e
cd "$(dirname "$0")/.."
VIDEOS_DIR="src/assets/videos"
BACKUP_DIR="src/assets/videos-backup"

# สร้างโฟลเดอร์ backup ถ้ายังไม่มี
mkdir -p "$BACKUP_DIR"

compress() {
  local input="$1"
  local base=$(basename "$input" .MP4)
  local temp="${VIDEOS_DIR}/${base}_compressed.mp4"

  echo "กำลังบีบอัด: $input"
  echo "  ก่อน: $(ls -lh "$input" | awk '{print $5}')"

  ffmpeg -y -i "$input" \
    -c:v libx264 \
    -crf 28 \
    -preset medium \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    "$temp" 2>/dev/null

  # เก็บต้นฉบับไว้ backup แล้วแทนที่ด้วยไฟล์บีบอัด
  mv "$input" "$BACKUP_DIR/"
  mv "$temp" "$input"

  echo "  หลัง: $(ls -lh "$input" | awk '{print $5}')"
  echo "  เสร็จแล้ว!"
  echo ""
}

# บีบอัดเฉพาะไฟล์ใหญ่ (> 100MB)
for f in "$VIDEOS_DIR"/IMG_9115.MP4 "$VIDEOS_DIR"/IMG_9122.MP4; do
  [ -f "$f" ] && compress "$f"
done

echo "สรุป: ไฟล์ต้นฉบับอยู่ที่ $BACKUP_DIR"
echo "สามารถลบโฟลเดอร์ backup ได้ถ้าโอเคกับผลลัพธ์"
