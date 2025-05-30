import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function finishGameHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const bodyRequest = req.body;
    bodyRequest.api_key = process.env.API_KEY;
    fetch(process.env.BACKEND_ENDPOINT + '/finish-game', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyRequest)
    })
        .then(response => response.json())
        .then(data => {
            console.log('[SERVER] Data received', data)
            res.status(200).json(data);
        })
        .catch(error => 
            {
                console.log('[SERVER] Error', error);
                res.status(201).json(error.message);
            }
        );
}
