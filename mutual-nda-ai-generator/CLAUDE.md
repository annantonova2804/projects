# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the
`templates` directory. The user uses an AI chat in order to establish what document they
want and how to fill in the fields. The available documents are covered in the
`catalog.json` file in the project root.

`catalog.json` does not exist yet — it needs to be created before the multi-document
catalog work starts. Until then, treat the Mutual NDA as the only entry.

Before we start: the initial implementation is a frontend-only prototype that only
supports the Mutual NDA document with no AI chat.

## Development process

When instructed to build a feature:

1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your GitHub tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via
OpenRouter to the `gpt-oss-120b` model with Cerebras as the inference provider. You
should use Structured Outputs so that you can interpret the results and populate fields
in the legal document.

## Technical design

The entire project should be packaged into a Docker container. The backend should be in
`backend/` and be a `uv` project, using FastAPI. The frontend should be in `frontend/`.
Consider statically building the frontend and serving it via FastAPI, if that will work.
The project should use a database that runs inside a Docker container.

There should be scripts in `scripts/` for:

- **setup** - install backend (`uv sync`) and frontend (`npm install`) dependencies
- **dev** - run backend and frontend in watch/dev mode against the local database
- **build** - build the frontend static assets and the backend/Docker image
- **test** - run backend and frontend test suites
- **lint** - run linters/formatters (and fail CI on violations)
- **migrate** - apply database migrations
- **seed** - load `catalog.json` and template fixtures into the database
- **docker:up** / **docker:down** - start/stop the full stack (app + database) via
  Docker Compose

## Current state vs. this spec

The codebase in this repo right now is the frontend-only prototype referenced above, but
it does include a client-side AI chat (calling Anthropic directly from the browser with a
user-supplied API key — see `AGENTS.md`), which differs from "no AI chat" above. Treat
this file as the target architecture for the full Prelegal product; reconcile that gap
before scoping the first Jira-driven feature.
