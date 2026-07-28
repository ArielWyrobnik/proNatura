from PIL import Image
import json, glob, os, sys
os.chdir(sys.argv[1] if len(sys.argv) > 1 else '.')
findings = []
for jf in sorted(glob.glob('rt-*.json')):
    d = json.load(open(jf))
    im = Image.open(d['shot']).convert('RGB'); px = im.load()
    W,H = im.size
    for bx in d['boxes']:
        x0 = max(0, bx['x']); y0 = max(0, bx['y'])
        x1 = min(W, bx['x']+bx['w']); y1 = min(H, bx['y']+bx['h'])
        if x1 <= x0 or y1 <= y0: continue
        hits = 0
        for y in range(y0, y1):
            for x in range(x0, x1):
                r,g,b = px[x,y]
                if r>170 and b>170 and g<100: hits += 1
        if hits > 0:
            findings.append((hits, f"{jf} {bx['tag']}.{bx['cls']} \"{bx['txt']}\" -> {hits} px"))
findings.sort(reverse=True)
print('\n'.join(f[1] for f in findings) if findings else 'KEIN Strahl über einer Textbox')
