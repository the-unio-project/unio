![](https://github.com/the-unio-project/unio/blob/main/github/assets/alt-logo_and_motto.png?raw=true)

---

<p align="center">
  <a href="#about">About</a> &nbsp;&bull;&nbsp;
  <a href="#running-locally">Running Locally</a> &nbsp;&bull;&nbsp;
  <a href="#variables">Variables</a> &nbsp;&bull;&nbsp;
  <a href="#deployed-project">Deployed Project</a>
</p>

## About
**Unio** is a project made to serve as an open-source, simple approach to project management, bringing in the core of what is necessary to handle tasks as a team.

## Running Locally
#### Services used
This project was made to function with Supabase & Supabase Storage.
#### Dependencies
- Docker
- Docker Compose
#### Process

First of all, clone the repository.

```bash
git clone https://github.com/the-unio-project/unio

cd unio
```

After this, you're gonna wanna copy the **.env.example** to **.env**, below is an example of how to do it through the terminal, though you can do it through the file explorer just fine.

```bash
cp .env.example .env
```

Now you're gonna wanna fill in the variables with your own keys, ports and information from supabase.

Once that's done with, run:

```bash
docker compose up --build
```
After this you should have a running copy of Unio running at `localhost:{port}`.

And to take it down:

```bash
docker compose down
```
or

`CTRL + C`

## Variables
You can find all the variables used in the code in the [.env.example](https://github.com/the-unio-project/unio/blob/main/.env.example) file.

## Deployed Project

...
