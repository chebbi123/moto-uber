import { updateConfig, updateAppData } from '../../updater/updateData.js';

export const exampleUpdateHandler = async (req, res) => {
  try {
    const newConfig = { key: 'value' };
    updateConfig('./config/appConfig.json', newConfig);

    await updateAppData({ someKey: 'someValue' });

    res.send({ message: 'Update completed successfully.' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to complete update.' });
  }
};
