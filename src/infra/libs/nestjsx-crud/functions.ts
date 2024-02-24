//#region Imports

import { CrudRequestTyped, SConditionTyped } from './@types/nestjsx-crud';

//#endregion

/**
 * Método que limpa e reseta algumas configurações passadas para a requisição CRUD
 *
 * @param crudRequest As informações da requisição da biblioteca Nestjx/Crud
 */
export function resetFiltersOnCrud<T>(crudRequest: CrudRequestTyped<T>): CrudRequestTyped<T> {
  crudRequest.parsed.or = [];
  crudRequest.parsed.filter = [];
  crudRequest.parsed.paramsFilter = [];

  return crudRequest;
}

/**
 * Método que aplica algumas condições a mais para o objeto do crudRequest
 *
 * @param crudRequest As informações da requisição da biblioteca Nestjx/Crud
 * @param patch A condição que será adiciona a pesquisa
 */
export function patchCrudResource<T>(crudRequest: CrudRequestTyped<T>, patch: SConditionTyped<T>): CrudRequestTyped<T> {
  return {
    ...crudRequest,
    parsed: {
      ...crudRequest.parsed,
      search: {
        $and: [patch, ...(crudRequest.parsed.search.$and || [])],
      },
    },
  };
}

/**
 * Método que garante que um join será feito.
 * É útil quando você precisa realizar um filtro em uma relação, e para isso, você precisa garantir que a relação foi incluida.
 *
 * @param crudRequest As informações da requisição da biblioteca Nestjx/Crud
 * @param joinName O nome do join
 * @param fields Os campos caso queira buscar apenas alguns campos para otimizar
 */
export function ensureJoin<T>(crudRequest: CrudRequestTyped<T>, joinName: string, fields?: string[]): CrudRequestTyped<T> {
  if (crudRequest.parsed.join.some((join) => join.field === joinName))
    return crudRequest;

  return {
    ...crudRequest,
    parsed: {
      ...crudRequest.parsed,
      join: [
        ...crudRequest.parsed.join,
        {
          field: joinName,
          select: fields,
        },
      ],
    },
  };
}
