import { chainP, fetchC, json } from 'chorus-utils';
import { join, map, pipe, zip } from 'ramda';

/**
 * mapTemplate :: (string -> string) -> Template -> string
 *
 * Resolves the given template to a string based on the given
 * variable mapping.
 */
export const mapTemplate = (f: (v: string) => string) =>
  pipe(
    (template: TemplateStringsArray, ...args: string[]) =>
      zip(template, args),
    map(([pathPart, queryPart]) => pathPart + f(queryPart)),
    join('')
  );

/**
 * Constructs a path with URI encoding template variables
 */
export const constructPath = mapTemplate(encodeURIComponent);

type Request = RequestInit & { host: string };

// callApi :: (Request -> Template -> Promise<Response>)
export const callApi = (req: Request) =>
  pipe(
    constructPath,
    (path: string) => `https://${req.host}${path}`,
    fetchC(req)
  );

// callApi :: a => (Request -> Template -> Promise<a>)
export const callJsonApi = <T>(req: Request) =>
  pipe(
    callApi(req),
    chainP(json<T>())
  );
