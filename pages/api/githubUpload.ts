import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch'; // Use 'node-fetch' for making HTTP requests in a Next.js API route

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const access_token = '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';
    const repo_owner = 'yourusername';
    const repo_name = 'yourrepository';

    // Create a new repository using the GitHub REST API
    const repo_url = `https://api.github.com/user/repos`;
    const data = {
      name: repo_name,
      private: true,  // Set to true for a private repository
    };
    const headers = {
      Authorization: `token ${access_token}`,
    };

    const response = await fetch(repo_url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (response.status === 201) {
      res.status(201).json({ message: `Repository ${repo_name} created successfully.` });
    } else {
      const errorData = (await response.json()) as { message: string };
      res.status(response.status).json({ error: `Failed to create repository: ${response.status} - ${errorData.message}` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
