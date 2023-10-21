import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { exec } from 'child_process'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const access_token = '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';
    const repo_owner = 'shnlli';
    const repo_name = 'newrepo';
    const user_code_directory = '/Code'; //????

    // Create a new repository using the GitHub REST API
    const repo_url = `https://api.github.com/user/repos`; //repository creation endpoint
    const data = {
      name: repo_name,
      private: true,
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
      // Initialize a Git repository
      exec('git init', { cwd: user_code_directory }, (initError, initStdout, initStderr) => {
        if (initError) {
          res.status(500).json({ error: 'Error initializing Git repository.' });
        } 
        else {
          exec('git add .', { cwd: user_code_directory }, (addError, addStdout, addStderr) => {
            if (addError) {
              res.status(500).json({ error: 'Error adding files to Git.' });
            } 
            else {
              exec('git commit -m "Initial commit"', { cwd: user_code_directory }, (commitError, commitStdout, commitStderr) => {
                if (commitError) {
                  res.status(500).json({ error: 'Error committing files to Git.' });
                } 
                else {
                  exec(`git remote add origin https://github.com/${repo_owner}/${repo_name}.git`, { cwd: user_code_directory }, (remoteError, remoteStdout, remoteStderr) => {
                    if (remoteError) {
                      res.status(500).json({ error: 'Error adding remote for GitHub.' });
                    } 
                    else {
                      exec('git push -u origin master', { cwd: user_code_directory }, (pushError, pushStdout, pushStderr) => {
                        if (pushError) {
                          res.status(500).json({ error: 'Error pushing code to GitHub repository.' });
                        } 
                        else {
                          res.status(201).json({ message: `Repository ${repo_name} created and code pushed successfully.` });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      const errorData = (await response.json()) as { message: string };
      res.status(response.status).json({ error: `Failed to create repository: ${response.status} - ${errorData.message}` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
