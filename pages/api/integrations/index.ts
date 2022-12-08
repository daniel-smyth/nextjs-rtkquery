import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import responses from '../../../config/strings';
import IntegrationDatabase from '../../../database/Integration';

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    res.status(500).json({ error: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Not found');
  }
})
  .post(postIntegration)
  .get(getAllIntegration);

async function postIntegration(req: NextApiRequest, res: NextApiResponse) {
  try {
    const integration = IntegrationDatabase.insert(JSON.parse(req.body));

    if (!integration) {
      return res.status(409).json({ error: responses.item_exists });
    }

    return res.status(201).json(integration);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}

function getAllIntegration(req: NextApiRequest, res: NextApiResponse) {
  try {
    const integrations = IntegrationDatabase.getAll();
    return res.status(200).json(integrations);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}
