# Achievement images

The easiest way to manage achievements is the admin dashboard:
`/admin/dashboard` → **Achievements**, where you can add, edit, reorder,
hide, and upload cover/certificate images for each entry.

Uploads are stored in MongoDB and served from `/uploads/...`, so they survive
redeploys.

If you prefer static files, drop them in this folder and reference them from
`src/data/achievements.ts` using paths like:

```
/images/achievements/hackathon-1.jpg
/images/achievements/hackathon-1-certificate.jpg
```

Recommended: JPG or WebP, longest edge around 2000px. Certificate images are
shown uncropped in the viewer, so keep the full document visible.

Any entry without an image path automatically renders the built-in
placeholder instead of a broken image.
