#!/usr/bin/env python3
"""Draw on-brand placeholder line-art cards for the fabrication gallery.
Limewash background + copper/ink line illustration of each item. These are
MOCKUPS — swap for real Higgsfield/photo product shots in /studio later.
Output: public/fabrication/<name>.png  (1100x825, 4:3)
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "fabrication")
os.makedirs(OUT, exist_ok=True)

W, H = 1100, 825
S = 2  # supersample
w, h = W * S, H * S

BG = (239, 231, 217)      # warm limewash
BG2 = (231, 221, 203)     # slightly deeper for floor
INK = (43, 38, 32)
COPPER = (156, 91, 44)
SOFT = (180, 165, 142)


def font(size):
    for p in [
        "/System/Library/Fonts/Supplemental/Futura.ttc",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
    ]:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()


def new_card():
    im = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(im)
    # subtle floor band + grounding shadow
    d.rectangle((0, int(h * 0.74), w, h), fill=BG2)
    return im, d


def finish(im, d, tag):
    # service tag, top-left
    f = font(34 * S)
    d.text((48 * S, 44 * S), tag.upper(), font=f, fill=COPPER)
    # corner ticks (blueprint feel)
    t = 26 * S
    for (x, y, dx, dy) in [
        (40 * S, 40 * S, 1, 1), (w - 40 * S, 40 * S, -1, 1),
        (40 * S, h - 40 * S, 1, -1), (w - 40 * S, h - 40 * S, -1, -1),
    ]:
        d.line((x, y, x + dx * t, y), fill=SOFT, width=3 * S)
        d.line((x, y, x, y + dy * t), fill=SOFT, width=3 * S)
    return im.resize((W, H), Image.LANCZOS)


def shadow(d, cx, cy, rw):
    d.ellipse((cx - rw, cy - 18 * S, cx + rw, cy + 18 * S), fill=BG2)


def LW(width):
    return max(1, int(width * S))


def save(im, name):
    im.save(os.path.join(OUT, name + ".png"))
    print("wrote", name)


cx = w // 2

# ---------------- MILLING ----------------
def bowl():
    im, d = new_card(); cy = int(h * 0.52)
    rw, rh = 300 * S, 78 * S
    rim_y = cy - 70 * S
    bodyH = 300 * S
    shadow(d, cx, rim_y + bodyH + 26 * S, 210 * S)
    # body: lower half of an ellipse centred on the rim line, so its sides meet
    # the rim ends and it curves down to depth bodyH.
    B = (cx - rw, rim_y - bodyH, cx + rw, rim_y + bodyH)
    d.arc(B, 5, 175, fill=INK, width=LW(7))
    d.ellipse((cx - rw, rim_y - rh, cx + rw, rim_y + rh), outline=INK, width=LW(7))
    d.ellipse((cx - rw + 40 * S, rim_y - rh + 22 * S, cx + rw - 40 * S, rim_y + rh - 22 * S),
              outline=COPPER, width=LW(4))
    return finish(im, d, "Milling")

def cup():
    im, d = new_card(); cy = int(h * 0.5)
    tw, bw = 165 * S, 120 * S
    ty, by = cy - 150 * S, cy + 175 * S
    shadow(d, cx, by + 20 * S, 150 * S)
    d.line((cx - tw, ty, cx - bw, by), fill=INK, width=LW(7))
    d.line((cx + tw, ty, cx + bw, by), fill=INK, width=LW(7))
    d.arc((cx - bw, by - 50 * S, cx + bw, by + 50 * S), 6, 174, fill=INK, width=LW(7))
    d.ellipse((cx - tw, ty - 34 * S, cx + tw, ty + 34 * S), outline=INK, width=LW(7))
    d.ellipse((cx - tw + 26 * S, ty - 20 * S, cx + tw - 26 * S, ty + 20 * S), outline=COPPER, width=LW(4))
    d.arc((cx + bw - 30 * S, cy - 70 * S, cx + bw + 150 * S, cy + 95 * S), -68, 70, fill=INK, width=LW(7))
    return finish(im, d, "Milling")

def candle():
    im, d = new_card(); cy = int(h * 0.55)
    shadow(d, cx, cy + 150 * S, 160 * S)
    # base
    d.ellipse((cx - 150 * S, cy + 110 * S, cx + 150 * S, cy + 175 * S), outline=INK, width=LW(7))
    d.line((cx - 150 * S, cy + 142 * S, cx - 60 * S, cy + 20 * S), fill=INK, width=LW(7))
    d.line((cx + 150 * S, cy + 142 * S, cx + 60 * S, cy + 20 * S), fill=INK, width=LW(7))
    # stem + cup
    d.line((cx - 60 * S, cy + 20 * S, cx - 60 * S, cy - 70 * S), fill=INK, width=LW(7))
    d.line((cx + 60 * S, cy + 20 * S, cx + 60 * S, cy - 70 * S), fill=INK, width=LW(7))
    d.ellipse((cx - 80 * S, cy - 92 * S, cx + 80 * S, cy - 48 * S), outline=INK, width=LW(7))
    # flame
    d.ellipse((cx - 20 * S, cy - 170 * S, cx + 20 * S, cy - 96 * S), outline=COPPER, width=LW(5))
    return finish(im, d, "Milling")

# ---------------- CNC ----------------
def screen():
    im, d = new_card()
    x0, y0, x1, y1 = cx - 330 * S, 150 * S, cx + 330 * S, h - 170 * S
    d.rounded_rectangle((x0, y0, x1, y1), radius=28 * S, outline=INK, width=LW(8))
    step = 92 * S
    yy = y0 + step // 2
    while yy < y1:
        xx = x0 + step // 2
        while xx < x1:
            r = 34 * S
            d.line((xx - r, yy, xx, yy - r), fill=COPPER, width=LW(4))
            d.line((xx, yy - r, xx + r, yy), fill=COPPER, width=LW(4))
            d.line((xx + r, yy, xx, yy + r), fill=COPPER, width=LW(4))
            d.line((xx, yy + r, xx - r, yy), fill=COPPER, width=LW(4))
            xx += step
        yy += step
    return finish(im, d, "CNC")

def sign():
    im, d = new_card(); cy = int(h * 0.5)
    x0, y0, x1, y1 = cx - 340 * S, cy - 170 * S, cx + 340 * S, cy + 170 * S
    shadow(d, cx, y1 + 30 * S, 300 * S)
    d.rounded_rectangle((x0, y0, x1, y1), radius=24 * S, outline=INK, width=LW(8))
    d.rounded_rectangle((x0 + 28 * S, y0 + 28 * S, x1 - 28 * S, y1 - 28 * S), radius=16 * S,
                        outline=COPPER, width=LW(4))
    for i, frac in enumerate([0.34, 0.5, 0.66]):
        yy = y0 + (y1 - y0) * frac
        ww = (x1 - x0) * (0.5 if i == 1 else 0.62)
        d.line((cx - ww / 2, yy, cx + ww / 2, yy), fill=INK, width=LW(10))
    return finish(im, d, "CNC")

def bracket():
    im, d = new_card()
    ax, ay = cx - 250 * S, 200 * S
    th = 70 * S
    L = 480 * S
    # vertical + horizontal arms (L), with live-edge wavy outer
    d.line((ax, ay, ax, ay + L), fill=INK, width=LW(8))
    d.line((ax, ay + L, ax + L, ay + L), fill=INK, width=LW(8))
    d.line((ax + th, ay + th, ax + th, ay + L - th), fill=INK, width=LW(8))
    d.line((ax + th, ay + L - th, ax + L - th, ay + L - th), fill=INK, width=LW(8))
    # diagonal brace
    d.line((ax + th, ay + L - th, ax + L - th, ay + th + 40 * S), fill=COPPER, width=LW(5))
    # screw holes
    for (hx, hy) in [(ax + th / 2 + 6 * S, ay + 60 * S), (ax + L - 60 * S, ay + L - th / 2 - 6 * S)]:
        d.ellipse((hx - 14 * S, hy - 14 * S, hx + 14 * S, hy + 14 * S), outline=INK, width=LW(5))
    return finish(im, d, "CNC")

# ---------------- LASER ----------------
def coasters(tag="Laser"):
    im, d = new_card(); cy = int(h * 0.52)
    offs = [(-150 * S, 90 * S), (10 * S, 30 * S), (170 * S, -30 * S)]
    r = 150 * S
    for (ox, oy) in offs:
        shadow(d, cx + ox, cy + oy + r + 14 * S, r)
    for (ox, oy) in offs:
        ccx, ccy = cx + ox, cy + oy
        d.ellipse((ccx - r, ccy - r, ccx + r, ccy + r), fill=BG, outline=INK, width=LW(7))
        d.ellipse((ccx - r + 28 * S, ccy - r + 28 * S, ccx + r - 28 * S, ccy + r - 28 * S),
                  outline=COPPER, width=LW(4))
    return finish(im, d, tag)

def cmap():
    im, d = new_card(); cy = int(h * 0.5)
    for i, k in enumerate([0, 1, 2]):
        o = k * 34 * S
        x0, y0, x1, y1 = cx - 320 * S + o, cy - 200 * S + o, cx + 320 * S - o, cy + 160 * S - o
        col = INK if k == 0 else COPPER if k == 2 else SOFT
        d.rounded_rectangle((x0, y0, x1, y1), radius=18 * S, outline=col, width=LW(6))
    # streets
    for fx in [0.3, 0.55, 0.78]:
        x = cx - 320 * S + (640 * S) * fx
        d.line((x, cy - 150 * S, x, cy + 110 * S), fill=INK, width=LW(3))
    for fy in [0.4, 0.7]:
        y = cy - 200 * S + (360 * S) * fy
        d.line((cx - 270 * S, y, cx + 270 * S, y), fill=INK, width=LW(3))
    return finish(im, d, "Laser")

def logo():
    im, d = new_card(); cy = int(h * 0.5)
    x0, y0, x1, y1 = cx - 330 * S, cy - 150 * S, cx + 330 * S, cy + 150 * S
    d.rounded_rectangle((x0, y0, x1, y1), radius=26 * S, outline=INK, width=LW(8))
    # abstract letterforms
    bx = cx - 200 * S
    d.ellipse((bx - 60 * S, cy - 70 * S, bx + 60 * S, cy + 70 * S), outline=COPPER, width=LW(8))
    d.line((cx - 10 * S, cy - 80 * S, cx - 10 * S, cy + 80 * S), fill=COPPER, width=LW(8))
    d.line((cx - 10 * S, cy - 80 * S, cx + 70 * S, cy - 80 * S), fill=COPPER, width=LW(8))
    d.line((cx - 10 * S, cy, cx + 55 * S, cy), fill=COPPER, width=LW(8))
    d.arc((cx + 120 * S, cy - 80 * S, cx + 250 * S, cy + 80 * S), -90, 180, fill=COPPER, width=LW(8))
    return finish(im, d, "Laser")

# ---------------- TEMPLATES ----------------
def lid():
    im, d = new_card(); cy = int(h * 0.5)
    x0, y0, x1, y1 = cx - 300 * S, cy - 230 * S, cx + 300 * S, cy + 230 * S
    shadow(d, cx, y1 + 24 * S, 280 * S)
    d.rounded_rectangle((x0, y0, x1, y1), radius=40 * S, outline=INK, width=LW(8))
    d.rounded_rectangle((x0 + 36 * S, y0 + 36 * S, x1 - 36 * S, y1 - 36 * S), radius=28 * S,
                        outline=COPPER, width=LW(4))
    # engraved diamond motif
    d.line((cx, cy - 70 * S, cx + 70 * S, cy), fill=INK, width=LW(5))
    d.line((cx + 70 * S, cy, cx, cy + 70 * S), fill=INK, width=LW(5))
    d.line((cx, cy + 70 * S, cx - 70 * S, cy), fill=INK, width=LW(5))
    d.line((cx - 70 * S, cy, cx, cy - 70 * S), fill=INK, width=LW(5))
    return finish(im, d, "Template")

def tray():
    im, d = new_card(); cy = int(h * 0.5)
    x0, y0, x1, y1 = cx - 360 * S, cy - 170 * S, cx + 360 * S, cy + 170 * S
    shadow(d, cx, y1 + 24 * S, 320 * S)
    d.rounded_rectangle((x0, y0, x1, y1), radius=30 * S, outline=INK, width=LW(8))
    d.rounded_rectangle((x0 + 34 * S, y0 + 34 * S, x1 - 34 * S, y1 - 34 * S), radius=20 * S,
                        outline=COPPER, width=LW(4))
    # handle cutouts
    for sx in (x0 + 90 * S, x1 - 90 * S):
        d.rounded_rectangle((sx - 14 * S, cy - 48 * S, sx + 14 * S, cy + 48 * S), radius=14 * S,
                            outline=INK, width=LW(5))
    return finish(im, d, "Template")

def tealight():
    im, d = new_card(); cy = int(h * 0.55)
    shadow(d, cx, cy + 120 * S, 150 * S)
    d.ellipse((cx - 130 * S, cy + 90 * S, cx + 130 * S, cy + 150 * S), outline=INK, width=LW(7))
    d.line((cx - 130 * S, cy + 120 * S, cx - 130 * S, cy - 30 * S), fill=INK, width=LW(7))
    d.line((cx + 130 * S, cy + 120 * S, cx + 130 * S, cy - 30 * S), fill=INK, width=LW(7))
    d.ellipse((cx - 130 * S, cy - 60 * S, cx + 130 * S, cy), outline=INK, width=LW(7))
    d.ellipse((cx - 80 * S, cy - 44 * S, cx + 80 * S, cy - 16 * S), outline=COPPER, width=LW(4))
    return finish(im, d, "Template")


jobs = {
    "milling-bowl": bowl, "milling-cup": cup, "milling-candle": candle,
    "cnc-screen": screen, "cnc-sign": sign, "cnc-bracket": bracket,
    "laser-coasters": coasters, "laser-map": cmap, "laser-logo": logo,
    "tpl-lid": lid, "tpl-tray": tray,
    "tpl-coasters": lambda: coasters("Template"), "tpl-tealight": tealight,
}

for name, fn in jobs.items():
    save(fn(), name)

print("done:", len(jobs), "images ->", os.path.abspath(OUT))
