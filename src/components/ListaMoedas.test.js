import React from 'react'
import ReactDOM from 'react-dom'
import ListaMoedas from './ListaMoedas'

describe('Testa o componente de listage de moedas', () => {
    it('deve renderizar o componente de listagem de moedas sem erros', () => {
        const div = document.createElement('div')
        ReactDOM.render(<ListaMoedas/>, div)
        ReactDOM.unmountComponentAtNode(div)
    })
})