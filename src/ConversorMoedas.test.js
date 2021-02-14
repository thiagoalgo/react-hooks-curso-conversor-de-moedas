import React from 'react'
import ReactDOM from 'react-dom'
import ConversorMoedas from './ConversorMoedas'
import { render, fireEvent } from '@testing-library/react'
import axiosMock from 'axios'

describe('Testa o componente de listage de moedas', () => {
    it('deve renderizar o componente conversor de moedas sem erros', () => {
        const div = document.createElement('div')
        ReactDOM.render(<ConversorMoedas/>, div)
        ReactDOM.unmountComponentAtNode(div)
    })

    it('deve fazer a conversao de duas moedas', async () => {
        const { findByTestId, getByTestId } = render(<ConversorMoedas/>)
        axiosMock.get.mockResolvedValueOnce({
            data: {success: true, rates: {BRL: 4.564292, USD: 1.101049}}
        })
        fireEvent.click(getByTestId('btn-converter'))
        const modal = await findByTestId('modal')
        expect(axiosMock.get).toHaveBeenCalledTimes(1)
        expect(modal).toHaveTextContent('0.24')
    })
})