import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';
import Container from '../../components/Container';

import { Loading, Owner, IssueList, ButtonPag, Footer, Header } from './styles';

export default class Repository extends Component {
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  // eslint-disable-next-line react/state-in-constructor
  state = {
    repository: {},
    issues: [],
    loading: true,
    page: 1,
    disableButton: true,
  };

  async componentDidMount() {
    this.reqService();
  }

  handleChange = e => {
    const { value } = e.target;

    this.setState({
      stateIssue: value,
    });
    this.setState({ page: 1, disableButton: true });
    this.reqService();
  };

  handleNextPage = () => {
    const { page } = this.state;

    this.setState({ page: page + 1 });

    this.reqService();
  };

  handlePreviousPage = () => {
    const { page } = this.state;

    if (page - 1 <= 1) {
      this.setState({ disableButton: true });
    } else {
      this.setState({ disableButton: false });
    }

    this.setState({ page: page - 1 });
    this.reqService();
  };

  handleSaber = () => {
    const { page } = this.state;
    console.log(page);
  };

  async reqService() {
    const { match } = this.props;

    const { stateIssue, page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: stateIssue,
          per_page: 5,
          page,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const {
      repository,
      issues,
      loading,
      stateIssue,
      disableButton,
    } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Header>
          <h3>
            Selecione o estado da Issue: <strong>{stateIssue}</strong>{' '}
          </h3>
          <div>
            <input
              name="stateRadio"
              type="radio"
              value="closed"
              onChange={this.handleChange}
            />
            Closed
            <input
              name="stateRadio"
              type="radio"
              value="open"
              onChange={this.handleChange}
            />
            Open
            <input
              name="stateRadio"
              type="radio"
              value="all"
              onChange={this.handleChange}
            />
            All
          </div>
        </Header>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>

        <Footer>
          <ButtonPag disabled={disableButton} onClick={this.handlePreviousPage}>
            Voltar
          </ButtonPag>
          <ButtonPag onClick={this.handleNextPage}>Próxima</ButtonPag>

          <ButtonPag onClick={this.handleSaber}>Saber</ButtonPag>
        </Footer>
      </Container>
    );
  }
}
