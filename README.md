# Kat with Bow Golf

A browser archery golf game featuring a Karl-Anthony Towns ragdoll, a stretchy tether, floating terrain, and an OB box that intercepts shots at the course boundary.

**[Play the game](https://davvidbaker.github.io/kat-with-bow-golf/)**

## Controls

- Press anywhere in the course, drag backward, and release to shoot.
- Shoot again in midair. Starting a new aim releases the previous tether.
- Hit the bullseye with an arrow to complete the hole.
- Old arrows continue flying and remain where they land.
- Use **Course view** to see the whole hole, or **R** to restart.

## Local development

The game is a standalone HTML file with its face image embedded. It needs no build step or runtime dependencies.

Serve `dist/` with any static web server, for example:

```sh
python3 -m http.server 8765 --directory dist
```

Open http://localhost:8765/.

Run the physics checks with Node.js 22 or later:

```sh
node scripts/check-ob.cjs
node scripts/check-arrows.cjs
```

GitHub Actions runs these checks and deploys `dist/` to GitHub Pages on pushes to `main`.

## Credits

This is an unofficial recreation of **Cat with Bow Golf** by **D of I (Dofi)**. Play the [original game on Addicting Games](https://www.addictinggames.com/sports/cat-with-bow-golf) or see its [2007 archive at Web Design Museum](https://www.webdesignmuseum.org/flash-games/cat-with-bow-golf-in-2007).

The Karl-Anthony Towns head uses the reference photo supplied for this project. Original-game and photo rights remain with their respective owners.
