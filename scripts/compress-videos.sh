#!/bin/bash
# บีบอัดวิดีโอให้ขนาดเล็กที่สุดเท่าที่ทำได้ด้วย ffmpeg (เน้นลดขนาดมากกว่าคุณภาพ)

set -uo pipefail
cd "$(dirname "$0")/.."

VIDEOS_DIR="${VIDEOS_DIR:-src/assets/videos}"
BACKUP_DIR="${BACKUP_DIR:-src/assets/videos-backup}"

# ปรับค่าด้านล่างเพื่อควบคุมคุณภาพ/ขนาด
CODEC="${CODEC:-libx265}"        # HEVC ขนาดเล็กกว่า H.264 เยอะ
CRF="${CRF:-36}"                 # ยิ่งมากยิ่งเล็ก (แนะนำ 30-38)
PRESET="${PRESET:-veryslow}"     # ยิ่งช้ายิ่งเล็ก
AUDIO_BITRATE="${AUDIO_BITRATE:-48k}"
AUDIO_CHANNELS="${AUDIO_CHANNELS:-1}"
SCALE="${SCALE:-960:-2}"         # ปรับความกว้างเพื่อลดขนาด (ตั้งเป็นค่าว่างเพื่อไม่ย่อ)
FPS="${FPS:-20}"                 # ลด fps เพื่อประหยัดขนาด (ตั้งเป็นค่าว่างเพื่อคงเดิม)
TARGET_MB="${TARGET_MB:-}"       # ตั้งเพื่อบังคับขนาดต่อไฟล์ (เช่น 6 หรือ 8)
SKIP_IF_BACKED_UP="${SKIP_IF_BACKED_UP:-0}"

mkdir -p "$BACKUP_DIR"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ไม่พบ ffmpeg กรุณาติดตั้งก่อนใช้งาน"
  exit 1
fi

HAS_FFPROBE=1
if ! command -v ffprobe >/dev/null 2>&1; then
  HAS_FFPROBE=0
  if [ -n "$TARGET_MB" ]; then
    echo "ไม่พบ ffprobe จึงไม่สามารถใช้ TARGET_MB ได้"
  fi
fi

get_size_bytes() {
  if stat -f%z "$1" >/dev/null 2>&1; then
    stat -f%z "$1"
  else
    stat -c%s "$1"
  fi
}

build_filters() {
  local filters=()
  if [ -n "$SCALE" ]; then
    filters+=("scale=${SCALE}:flags=lanczos")
  fi
  if [ -n "$FPS" ]; then
    filters+=("fps=${FPS}")
  fi

  if [ ${#filters[@]} -gt 0 ]; then
    local IFS=,
    echo "${filters[*]}"
  fi
}

bitrate_to_bps() {
  local v="$1"
  case "$v" in
    *[kK]) echo $(( ${v%[kK]} * 1000 )) ;;
    *[mM]) echo $(( ${v%[mM]} * 1000 * 1000 )) ;;
    *) echo "$v" ;;
  esac
}

cleanup_passlog() {
  local log="$1"
  rm -f "${log}-0.log" "${log}-0.log.mbtree" "$log" || true
}

compress() {
  local input="$1"
  local base
  base=$(basename "$input")
  local name="${base%.*}"
  local temp="${VIDEOS_DIR}/.${name}.compressed.mp4"
  local passlog="${VIDEOS_DIR}/.${name}.passlog"

  if [ "$SKIP_IF_BACKED_UP" -eq 1 ] && [ -f "$BACKUP_DIR/$base" ]; then
    echo "ข้าม (มี backup แล้ว): $input"
    return
  fi

  if [ ! -s "$input" ]; then
    echo "ข้าม (ไฟล์ว่าง/อ่านไม่ได้): $input"
    echo ""
    return
  fi

  echo "กำลังบีบอัด: $input"
  echo "  ก่อน: $(ls -lh "$input" | awk '{print $5}')"

  local vf
  vf="$(build_filters || true)"

  if [ -n "$TARGET_MB" ]; then
    local duration total_bps audio_bps video_bps
    if [ "$HAS_FFPROBE" -eq 0 ]; then
      echo "  ข้าม (ไม่มี ffprobe จึงคำนวณ TARGET_MB ไม่ได้)"
      echo ""
      return
    fi

    duration="$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$input" || true)"
    if [ -z "$duration" ] || [ "$duration" = "N/A" ]; then
      echo "  ไฟล์เสีย/อ่านไม่ได้ -> ข้าม"
      echo ""
      return
    fi

    total_bps="$(awk -v mb="$TARGET_MB" -v dur="$duration" 'BEGIN{ if(dur<=0){print 0; exit} printf "%.0f", (mb*8*1024*1024)/dur }')"
    if [ "$total_bps" -le 0 ]; then
      echo "  คำนวณ bitrate ไม่ได้ -> ข้าม"
      echo ""
      return
    fi
    audio_bps="$(bitrate_to_bps "$AUDIO_BITRATE")"
    video_bps=$(( total_bps - audio_bps ))
    if [ "$video_bps" -lt 100000 ]; then
      video_bps=100000
    fi

    if ! ffmpeg -y -nostdin -hide_banner -loglevel error -i "$input" \
      -map 0:v:0 -map 0:a? \
      -c:v "$CODEC" \
      -b:v "$video_bps" \
      -maxrate "$video_bps" \
      -bufsize $(( video_bps * 2 )) \
      -preset "$PRESET" \
      -pix_fmt yuv420p \
      -tag:v hvc1 \
      ${vf:+-vf "$vf"} \
      -an \
      -pass 1 \
      -passlogfile "$passlog" \
      -f mp4 /dev/null; then
      echo "  บีบอัดไม่สำเร็จ (pass 1) -> ข้าม"
      cleanup_passlog "$passlog"
      echo ""
      return
    fi

    if ! ffmpeg -y -nostdin -hide_banner -loglevel error -i "$input" \
      -map 0:v:0 -map 0:a? \
      -c:v "$CODEC" \
      -b:v "$video_bps" \
      -maxrate "$video_bps" \
      -bufsize $(( video_bps * 2 )) \
      -preset "$PRESET" \
      -pix_fmt yuv420p \
      -tag:v hvc1 \
      ${vf:+-vf "$vf"} \
      -c:a aac \
      -b:a "$AUDIO_BITRATE" \
      -ac "$AUDIO_CHANNELS" \
      -pass 2 \
      -passlogfile "$passlog" \
      -movflags +faststart \
      "$temp"; then
      echo "  บีบอัดไม่สำเร็จ (pass 2) -> ข้าม"
      cleanup_passlog "$passlog"
      rm -f "$temp"
      echo ""
      return
    fi

    cleanup_passlog "$passlog"
  else
    if ! ffmpeg -y -nostdin -hide_banner -loglevel error -i "$input" \
      -map 0:v:0 -map 0:a? \
      -c:v "$CODEC" \
      -crf "$CRF" \
      -preset "$PRESET" \
      -pix_fmt yuv420p \
      -tag:v hvc1 \
      ${vf:+-vf "$vf"} \
      -c:a aac \
      -b:a "$AUDIO_BITRATE" \
      -ac "$AUDIO_CHANNELS" \
      -movflags +faststart \
      "$temp"; then
      echo "  บีบอัดไม่สำเร็จ -> ข้าม"
      rm -f "$temp"
      echo ""
      return
    fi
  fi

  local before_bytes after_bytes
  before_bytes="$(get_size_bytes "$input")"
  after_bytes="$(get_size_bytes "$temp")"

  if [ "$after_bytes" -ge "$before_bytes" ]; then
    echo "  หลัง: $(ls -lh "$temp" | awk '{print $5}')"
    echo "  ผลลัพธ์ใหญ่ขึ้น/เท่ากัน -> ไม่แทนที่ไฟล์เดิม"
    rm -f "$temp"
    echo ""
    return
  fi

  mv "$input" "$BACKUP_DIR/$base"
  mv "$temp" "$input"

  echo "  หลัง: $(ls -lh "$input" | awk '{print $5}')"
  echo "  เสร็จแล้ว!"
  echo ""
}

found=0
while IFS= read -r -d '' f; do
  found=1
  compress "$f"
done < <(find "$VIDEOS_DIR" -maxdepth 1 -type f -iname "*.mp4" -print0)

if [ "$found" -eq 0 ]; then
  echo "ไม่พบไฟล์ .MP4 ใน $VIDEOS_DIR"
fi

echo "สรุป: ไฟล์ต้นฉบับอยู่ที่ $BACKUP_DIR"
echo "สามารถลบโฟลเดอร์ backup ได้ถ้าโอเคกับผลลัพธ์"
