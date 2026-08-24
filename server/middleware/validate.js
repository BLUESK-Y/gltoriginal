/** Validate req.body against a zod schema, replacing it with the parsed value. */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      // Field-keyed so the client can put each message under its own input.
      fields: result.error.issues.reduce((acc, issue) => {
        const key = issue.path.join('.') || '_';
        if (!acc[key]) acc[key] = issue.message;
        return acc;
      }, {}),
    });
  }

  req.body = result.data;
  next();
};
