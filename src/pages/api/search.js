// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    const { query } = req.query;
    const base_url = process.env.API_URL + "/semantic-search";
    const token = 'Bearer ' + process.env.API_TOKEN;
    const new_query = encodeURIComponent(query);

    const response = await fetch(
        `http://${base_url}?query=${new_query}`,
        {headers: {
            'Authorization': token
        }}
    )

    if (!response.ok) {
        res.status(500).json({ error: 'Internal server error.' });
        return;
    } else {
        const data = await response.json();
        res.status(200).json(data);   
    } 
  }
  