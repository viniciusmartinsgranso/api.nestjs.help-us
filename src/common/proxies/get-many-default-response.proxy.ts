//#region Imports

import { ApiProperty } from '@nestjs/swagger';

//#endregion

/**
 * A classe que representa as informações básicas de toda entidade que será enviada para o usuário
 */
export class GetManyDefaultResponseProxy {

  /**
   * A contagem de quantos items veio nessa busca limitado pelo pageCount
   */
  @ApiProperty()
  public count!: number;

  /**
   * O total de itens que essa busca pode retornar
   */
  @ApiProperty()
  public total!: number;

  /**
   * A página na qual está essa busca
   */
  @ApiProperty()
  public page!: number;

  /**
   * A quantidade de itens que deve retornar por página
   */
  @ApiProperty()
  public pageCount!: number;

}
