import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {
  if (request.method == 'POST') {
    const TOKEN = 'ef20a28c7b1eaad7bd32df6fb2eb3d';
    const client = new SiteClient(TOKEN);

    //Validar os dados antes de cadastrar
    const registroCriado = await client.items.create({
      itemType: '968676', //ID do models criado pelo Dato / Comunidades
      ...request.body,
    });

    response.json({
      registroCriado: registroCriado,
    });

    return;
    }
    response.status(404).json({
      message: 'Ainda não temos nada no GET'
  })
}
