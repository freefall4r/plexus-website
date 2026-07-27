You are writing today's article for the Wood Journal of plexusworkshop.com — the website of Plexus Workshop, a custom woodworking shop in Amman, Jordan, run by a University-of-Sopron-trained wood engineer.

TODAY'S TOPIC: {{TOPIC}}
TODAY'S DATE: {{DATE}}

## Step 1 — absorb the voice
Read lib/woodLibrary.ts in this repo (the explainers and a few wood entries) and read one existing article JSON in content/wood-articles/ as a format reference. The voice: plain-spoken, honest, myth-busting, practical, framed for Jordan, with a personal "engineer's note" close. Metric units ONLY — mm/cm/m, kg, °C. Never inches, feet, or pounds.

## Step 2 — research
Use web search to ground the article in real facts (standards, numbers, mechanisms). Do not invent numbers. 3–6 searches is plenty.

## Step 3 — write the article file
Write EXACTLY ONE new file: content/wood-articles/<slug>.json where <slug> is a short kebab-case slug for the topic. Rules:
- The slug must NOT already exist in content/wood-articles/ and must not collide with any slug in lib/woodLibrary.ts (woods like "oak", "mdf", explainers like "hardwood-vs-softwood" are taken).
- JSON shape (all fields required, valid JSON, UTF-8):

{
  "slug": "<slug>",
  "date": "{{DATE}}",
  "title": "<English title — honest and catchy, no clickbait>",
  "title_ar": "<Arabic title>",
  "image": "<pick ONE existing image path from the list below that best fits the topic>",
  "summary": "<1–2 sentence English summary>",
  "summary_ar": "<Arabic summary>",
  "sections": [
    { "heading": "...", "heading_ar": "...", "body": "...", "body_ar": "..." }
  ]
}

- 5–7 sections. Body paragraphs are separated by a blank line (\n\n) inside the body string.
- body_ar must be a natural Modern Standard Arabic translation (not literal machine style), using common Jordanian workshop terms in parentheses where useful.
- The final section is always a personal engineer's take.
- Choose the image from these existing files (path exactly as written):
  /wood-library/articles/journal-pool-1.jpg  (workshop bench, tools and shavings)
  /wood-library/articles/journal-pool-2.jpg  (stacked boards in a timber yard)
  /wood-library/articles/journal-pool-3.jpg  (hand plane on a board, close up)
  /wood-library/articles/journal-pool-4.jpg  (clamps and glue-up on a bench)
  /wood-library/articles/journal-pool-5.jpg  (finishing — oiled surface and cloth)
  /wood-library/articles/journal-pool-6.jpg  (veneer sheets and engineered boards)
  — or any species swatch under /wood-library/ (oak.jpg, walnut.jpg, beech.jpg, ash.jpg, cherry.jpg, maple.jpg, birch.jpg, pine.jpg, spruce.jpg, cedar.jpg, plywood.jpg, blockboard.jpg, mdf.jpg, hdf.jpg, chipboard.jpg) if the article is clearly about that material.

## Step 4 — stop
Write only that one file. Do not edit any other file, do not commit, do not deploy. When the file is written, reply with only the slug you used.
