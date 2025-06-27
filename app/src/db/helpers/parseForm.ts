import formidable, { IncomingForm } from "formidable";
import { IncomingMessage } from "http";

export const parseForm = (
  req: Request
): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
}> => {
  return new Promise((resolve, reject) => {
    // Gunakan IncomingForm langsung atau formidable.IncomingForm
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req as unknown as IncomingMessage, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};
