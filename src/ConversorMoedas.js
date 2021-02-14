import './ConversorMoedas.css';
import { Container, Jumbotron, Form, Col, Button, Spinner, Alert, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import ListaMoedas from './components/ListaMoedas'
import { useState } from 'react';
import axios from 'axios'

function ConversorMoedas() {

  const FIXER_URL = 'http://data.fixer.io/api/latest?access_key=eba7130a5b2d720ce43eb5fcddd47cc3';

  const [valor, setValor] = useState('1')
  const [moedaDe, setMoedaDe] = useState('BRL')
  const [moedaPara, setMoedaPara] = useState('USD')
  const [exibirSpinner, setExibirSpinner] = useState(false)
  const [formValidado, setFormValidado] = useState(false)
  const [exibirModal, setExibirModal] = useState(false)
  const [resultadoConversao, setResultadoConversao] = useState('')
  const [exibirAlerta, setExibirAlerta] = useState(false)

  function handleValor(event) {
    setValor(event.target.value.replace(/\D/g, ''))
  }

  function handleMoedaDe(event) {
    setMoedaDe(event.target.value)
  }

  function handleMoedaPara(event) {
    setMoedaPara(event.target.value)
  }

  function handleFecharModal() {
    setValor('1')
    setMoedaDe('BRL')
    setMoedaPara('USD')
    setFormValidado('false')
    setExibirModal(false)
  }

  function converter(event) {
    event.preventDefault()
    setFormValidado(true)

    if (event.currentTarget.checkValidity() === true) {
      setExibirSpinner(true)
      axios.get(FIXER_URL)
        .then(res => {
          const cotacao = obterCotacao(res.data)
          if (cotacao) {
            setResultadoConversao(cotacao)
            setExibirModal(true)
            setExibirSpinner(false)
            setExibirAlerta(false)
          } else {
            setExibirSpinner(false)
            setExibirAlerta(true)
          }
      }).catch(err => {
        setExibirSpinner(false)
        setExibirAlerta(true)
      })
    }

    function obterCotacao(data) {
      if (!data || data.success !== true) {
        return false;
      }
      const cotacaoDe = data.rates[moedaDe]
      const cotacaoPara = data.rates[moedaPara]
      const cotacao = (1 / cotacaoDe * cotacaoPara) * valor
      return cotacao.toFixed(2)
    }
  }

  return (
    <Container>
      <h1>Conversor de Moedas</h1>
      <Alert variant="danger" show={exibirAlerta}>
        Erro ao obter dados de conversão
      </Alert>
      <Jumbotron>
        <Form
          onSubmit={converter}
          noValidate
          validated={formValidado}>
          <Form.Row>
            <Col xs="3">
              <Form.Control
                placeholder="Valor"
                required
                value={valor}
                onChange={handleValor}
              />
            </Col>
            <Col xs="3">
              <Form.Control
                as="select"
                value={moedaDe}
                onChange={handleMoedaDe}>
                <ListaMoedas />
              </Form.Control>
            </Col>
            <Col xs="1"
              className="text-center"
              style={{ paddingTop: '5px' }}>
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </Col>
            <Col xs="3">
              <Form.Control
                as="select"
                value={moedaPara}
                onChange={handleMoedaPara}>
                <ListaMoedas />
              </Form.Control>
            </Col>
            <Col xs="2">
              <Button 
              variant="success" 
              type="submit"
              data-testid="btn-converter" 
              block>
                <span className={exibirSpinner ? null : 'hidden'}>
                  <Spinner animation="border" size="sm" />
                </span>
                <span className={exibirSpinner ? 'hidden' : null}>
                  Converter
                </span>
              </Button>
            </Col>
          </Form.Row>
        </Form>
        <Modal
          show={exibirModal}
          onHide={handleFecharModal}
          data-testid="modal">
          <Modal.Header closeButton>
            <Modal.Title>Conversão de Moedas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {resultadoConversao}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={handleFecharModal}>
              Nova Conversão
              </Button>
          </Modal.Footer>
        </Modal>
      </Jumbotron>
    </Container>
  );
}

export default ConversorMoedas;
