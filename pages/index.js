import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import {
  AlurakutMenu,
  OrkutNostalgicIconSet,
  AlurakutProfileSidebarMenuDefault,
} from '../src/lib/AluraCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${propriedades.githubUser}.png`}
        style={{ borderRadius: '8px' }}
      />
      <hr />
      <p>
        <a
          className="boxLink"
          href={` https://github.com/${propriedades.githUser} `}
        >
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.itens.length})
      </h2>
      {/* <ul>
      {seguidores.map((itemAtual) => {
        return (
          <li key={itemAtual}>
            <a href={`https://github.com/${itemAtual}.png`}>
              <img src={itemAtual.image} />
              <span>{itemAtual.title}</span>
            </a>
          </li>
        );
      })}
    </ul> */}
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const [comunidades, setComunidades] = React.useState([
    {
      id: '3-56-482w4',
      title: 'Muay Thai',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/9/9a/Muay_Thai_Fight_Us_Vs_Burma_%2880668065%29.jpeg',
    },
  ]);
  const usuarioAleatorio = 'leokattah';
  // const comunidades =  comunidades[0];
  // const alteradorDeComunidades/setComunidades = comunidades[1];
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
  ];

  const [seguidores, setSeguidores] = React.useState([]);

  fetch('https://api.github.com/users/leokattah/followers')
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function (respostaCompleta) {
      setSeguidores(respostaCompleta);
    });



  // 1- Pegar o array de dados do github
  //2- Criar um box que vai ter um map, baseado nos itens do array que pegamos do github.
  React.useEffect(function () {

  // 1- Pegar o array de dados do graphQL
  fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      Authorization: 'ee5a8c7171d3908968094c2cf5ae5c',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      'query': `query {
        allCommunities {
          title
          id
          imageUrl
          creatorSlug
        }
      }`}),
  })
    .then((response) => response.json())
    .then((responseCommunities) => {
      const handleNewCommunities = responseCommunities.data.allCommunities
      setComunidades(handleNewCommunities)
    })
}, [])

    return (
      <>
        <AlurakutMenu />
        <MainGrid>
          {/* <Box style="grid-area: profileArea;"> */}
          <div className="profileArea" style={{ gridArea: 'profileArea' }}>
            <ProfileSidebar seguidores={usuarioAleatorio} />
          </div>
          <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
            <Box>
              <h1 className="title">Bem vindo(a)</h1>
              <OrkutNostalgicIconSet />
            </Box>
            <Box>
              <h2 className="subTitle">O que você deseja fazer?</h2>
              {/* A função onSubmit foi criada para previnir a renderização de toda a página quando o botão for clicado */}
              <form
                onSubmit={function handleCriaComunidade(e) {
                  e.preventDefault();

                  // capturando os dados digitados nos inputs do form
                  const dadosDoForm = new FormData(e.target);

                  const comunidade = {
                    id: new Date().toISOString(),
                    title: dadosDoForm.get('title'),
                    image: dadosDoForm.get('image'),
                  };

                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                  // comunidades.push('alura Stars');
                }}
              >
                <div>
                  <input
                    placeholder="Qual vai ser o nome da sua comunidade?"
                    name="title"
                    aria-label="Qual vai ser o nome da sua comunidade?"
                    type="text"
                  />
                </div>

                <div>
                  <input
                    placeholder="Coloque uma URL para usarmos de capa"
                    name="image"
                    aria-label="Coloque uma URL para usarmos de capa"
                  />
                </div>
                <button>Criar comunidade</button>
              </form>
            </Box>
          </div>
          <div
            className="profileRelationsArea"
            style={{ gridArea: 'profileRelationsArea' }}
          >
            <ProfileRelationsBox title="Seguidores" itens={seguidores} />

            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
              <ul>
                {comunidades.map((itemAtual) => {
                  return (
                    <li key={itemAtual.id}>
                      <a href={`/users/${itemAtual.title}`}>
                        <img src={itemAtual.image} />
                        <span>{itemAtual.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </ProfileRelationsBoxWrapper>

            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">
                Pessoas da comunidade ({pessoasFavoritas.length})
              </h2>
              <ul>
                {pessoasFavoritas.map((itemAtual) => {
                  return (
                    <li key={itemAtual}>
                      <a href={`/users/${itemAtual}`}>
                        <img src={`https://github.com/${itemAtual}.png`} />
                        <span>{itemAtual}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </ProfileRelationsBoxWrapper>
          </div>
        </MainGrid>
      </>
    )
  }
