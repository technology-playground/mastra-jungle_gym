# Construction Meeting Recap & Punch List Generator

## Overview

This hackathon‐MVP combines Mastra agent workflows and a lightweight Hono frontend to automate the creation of:

1. **Weekly Construction Meeting Recaps** (detailed meeting minutes in a structured Markdown/PDF template).
2. **Property Walk‑Through Punch Lists** (action items with location, code, drawings, and recommended fixes).

By simply uploading an audio file (MP3/M4A) of a project meeting or property inspection, the system:

- Splits the audio into manageable chunks
- Transcribes each segment
- Applies custom AI prompts to generate fully formatted reports
- Presents final documents for download or emails them to stakeholders

## Problem Statement

Project managers and site inspectors spend hours manually reviewing meeting recordings or walk‑through notes to compile minutes and punch lists. This repetitive task is:

- Time‑consuming and error‑prone
- Delayed by back‑and‑forth clarifications
- Difficult to distribute in a consistent, professional format

**Goal:** Reduce a 1‑hour audio file to polished, shareable deliverables in just minutes, ensuring consistency and freeing managers to focus on decisions, not documentation.

## Solution

The application offers:

- **Drag‑&‑Drop UI** using react for immediate audio upload
- **Mastra Agent Pipeline** with stubbed or real integration steps:

  1. **Audio Chunker**: split large files into 5‑minute segments
  2. **Transcribe**: feed chunks to Whisper or similar STT
  3. **MeetingRecap Generator**: prompt‐driven Markdown report
  4. **PunchList Builder**: extract actionable inspection items
  5. **Package & Notify**: generate PDF, email, or display in browser

## Architecture & Tech Stack

- **Frontend**: [Vite](https://vite.dev/) [React](https://react.dev/)for drag‑and‑drop, status updates, and document preview
- **Backend**: [Mastra](https://mastra.ai/) workflows to orchestrate chunking, transcription, and generation
- **Transcription Service**: Whisper API
- **PDF Generation**: TBD
- **Email Delivery**: TBD
- **Deployment**:

  - Mastra Cloud for agent execution
  - Fly.io (Docker) for Hono frontend and webhook endpoints

- **CI/CD**: GitHub Actions to build, test, and deploy each push

## Setup & Quickstart

** Comming Soon**

## Usage & Demo

1. **Upload Audio**: Drop your 30–60 minute meeting file
2. **Monitor Progress**: See chunking, transcription, and generation status
3. **Review Reports**: View or download the Construction Meeting Minutes and/or Punch List
4. **Email Stakeholders**: Click “Send Report” to SMS‑style notify recipients

## Future Improvements

- **Real‑time transcription** during live calls
- **Multi‑language support** for international projects
- **Advanced RBAC** to manage team roles and report access
- **Analytics Dashboard** for meeting trends and punch‑list completion rates
