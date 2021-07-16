import { SiteClient } from 'datocms-client'
export default async function recebedorDeRequests(request, response) {

    if (request.method === 'POST') {
      const TOKEN = 'ef20a28c7b1eaad7bd32df6fb2eb3d';
        const client = new SiteClient(TOKEN);


        const registroCriado = await client.items.create({
            itemType: "968676", //Id criado pelo DATO
            ...request.body,
            // title: "Comunidade zura",
            // imageUrl: "https://github.com/leokattah.png",
            // url: "https://github.com/leokattah"
        })
        response.json({
            dados: 'TEM DADOS EM CASA?',
            registroCriado: registroCriado,
        })
        return;
    }
    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })

}