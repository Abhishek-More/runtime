**TLDR**: Competitive programming platform that allowed for racing (like typeracer) and a 'session replay' analysis feature for educating new coders. Fully functional code execution, real-time multiplayer, connectivity, NLP analysis, and more!

## Inspiration
As of 2023, the Software Engineer market is in shambles, and the industry is extremely competitive. In order to stand out, applicants need to hone their technical interviewing abilities. Additionally, younger students who are passionate about computer science need to be prepared to enter this job market. Most technical interviews usually involve competitive programming, which is a series of coding challenges ranging from easy to hard. Despite this, most universities fail to teach competitive programming in core curriculums. Runtime solves this by offering a comprehensive competitive programming platform that gamifies learning, while providing assistance with AI.

## What it does
Runtime solves this by offering a comprehensive competitive programming platform that gamifies learning, while providing assistance with AI. It has several features:

### Realtime Multiplayer Races
We've noticed that it is difficult to learn competitive programming by yourself. Runtime offers a typeracer-style coding game where players go head-to-head to complete 5-10 programming problems quickly. We aim to improve decision-making time and general syntax knowledge of the computer science community. We accomplished real-time multiplayer connectivity with Firestore.

### Assisted Individual Problems
If you just want to review problems alone, Runtime has a single-player mode as well. This unlimited time mode offers AI assistance by providing relevant hints to a problem before revealing the solution. In our experience, most students tend to give up and check the solution when they get stuck. WIth this feature, students are encouraged to keep trying and push themselves to discover the optimal solution.

### Session Replay
Runtime allows users to watch a replay of their solution and utilizes NLP to determine important events (binary heap implemented at t=10s). We believe that seeing this information will give users the opportunity to learn their strengths and weaknesses. These videos can also be sent to friends and peers as competition.

## How we built it
React/Next.JS, Firebase, OpenAI API, TailwindCSS, Chakra UI, TypeScript

## Challenges we ran into
One of the challenges we ran into was combining all of our separate features. To do so, we had a **large** amount of merge conflicts that we had to handle before being able to keep making progress.

## Accomplishments that we're proud of
We worked on many features that we have never done before. For example, we used Firebase and Firestore for the first time. We are also proud of the playful art.

## What we learned
We learned a lot about NoSQL databases, as well as realtime connectivity.

## What's next for Runtime
Billions and Millions
