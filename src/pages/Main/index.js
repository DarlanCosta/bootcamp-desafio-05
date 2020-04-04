import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Container from '../../components/Container';

import { Form, SubmitButton, List, InputRepo } from './styles';

export default class Main extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    erro: false,
  };

  // Carregar os dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Salvar os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    try {
      e.preventDefault();
      const { newRepo, repositories } = this.state;

      if (repositories.length > 0) {
        const getRepos = JSON.parse(localStorage.getItem('repositories'));

        if (getRepos.filter(filtro => filtro.name === newRepo).length > 0) {
          throw new Error('Repositório duplicado');
        }
      }

      this.setState({ loading: true });

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
        erro: false,
      });
    } catch (error) {
      this.setState({ loading: false, newRepo: '', erro: true });
      console.log(error);
    }
  };

  render() {
    const { newRepo, repositories, loading, erro } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <InputRepo
            erro={erro}
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton load={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
