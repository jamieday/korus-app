export interface Resource<TAttr, TRel> {
  id: string;
  type: string;
  href: string;
  attributes: TAttr;
  relationships: TRel;
}

export interface Error {
  code: string;
  detail: string | undefined;
  id: string;
  source: { parameter: string };
  status: string;
  title: string;
}

export interface ResponseRoot<TAttr, TRel> {
  data: Resource<TAttr, TRel>[];
  errors: Error[];
  href: string;
}
