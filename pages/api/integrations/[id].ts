import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import responses from '../../../config/strings';
import Database from '../../../database';

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.log(err.message); // eslint-disable-line no-console
    res.status(500).json({ error: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Not found');
  }
})
  .get(getIntegration)
  .post(postIntegration)
  .delete(deleteIntegration);

async function getIntegration(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const integration = Database.getIntegration(id as string);

    if (!integration) {
      return res.status(404).json({ error: responses.item_not_found });
    }

    return res.status(200).json(integration);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}

async function postIntegration(req: NextApiRequest, res: NextApiResponse) {
  try {
    const integration = Database.connectIntegration(JSON.parse(req.body));

    if (!integration) {
      return res.status(409).json({ error: responses.item_exists });
    }

    return res.status(200).json(integration);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}

async function deleteIntegration(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const result = Database.disconnectIntegration(id as string);

    if (!result) {
      return res.status(404).json({ error: responses.item_not_found });
    }

    return res.status(200).json({ message: responses.success });
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}
