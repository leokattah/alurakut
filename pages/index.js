import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AluraCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img
        style={{ borderRadius: '100px' }}
        src={`https://github.com/${propriedades.githubUser}.png`}
      ></img>
      <hr />
      <p>
        <a
          className="boxLink"
          href={`https://github.com/${propriedades.githubUser}`}
        >
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsList(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {propriedades.items.slice(0, 6).map((username, key) => {
          return (
            <li key={key}>
              <a
                href={
                  propriedades.title == 'Amigos'
                    ? `https://github.com/${username.login}.png`
                    : `/comunidades/${username.title}`
                }
                key={username.login}
              >
                <img
                  src={
                    propriedades.title == 'Amigos'
                      ? `https://github.com/${username.login}.png`
                      : username.imageUrl
                  }
                />

                <span>
                  {propriedades.title == 'Amigos'
                    ? username.login
                    : username.title}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {propriedades.items.length > 6 ? <a href="/amigos">Ver mais</a> : ''}
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const [comunidades, setComunidades] = React.useState([]);
  const githubUser = 'leokattah';

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function () {
    fetch('https://api.github.com/users/leokattah/followers').then(
      async function (serverResponse) {
        const response = await serverResponse.json();
        setSeguidores(response);
      }
    );

    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'ef20a28c7b1eaad7bd32df6fb2eb3d',
      },
      body: JSON.stringify({
        query: `query {
          allCommunities {
            title
            id
            imageUrl
            creatorSlug
          }
        }`,
      }),
    })
      .then((response) => response.json())
      .then((responseCommunities) => {
        const handleNewCommunities = responseCommunities.data.allCommunities;
        setComunidades(handleNewCommunities);
      });
  }, []);

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo (a), Leokattah!</h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCreateCommunity(e) {
                e.preventDefault();

                const dataForm = new FormData(e.target);
                const comunidade = {
                  title: dataForm.get('title'),
                  imageUrl: dataForm.get('image'),
                  creatorSlug: githubUser,
                };

                fetch('api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade),
                }).then(async (response) => {
                  const dados = await response.json();
                  const comunidade = dados.registroCriado;

                  const comunidadesAtualizadas = [...comunidades, comunidade];

                  setComunidades(comunidadesAtualizadas);
                });
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  area-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  area-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
          <Box>
            <h2 className="smallTitle">Depoimentos</h2>
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsList title="Amigos" items={seguidores} />
          <ProfileRelationsList title="Comunidades" items={comunidades} />
        </div>
      </MainGrid>
    </>
  );
}
