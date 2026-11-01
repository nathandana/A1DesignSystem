import { previewService } from '../../lib/previews.mjs';

export default async () => Response.json(await previewService.cleanup());
export const config = { schedule: '17 * * * *' };
