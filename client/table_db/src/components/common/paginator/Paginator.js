import React, {useState} from 'react'
import s from './Paginator.module.scss'

export const Paginator = React.memo(({
                                         onPageChanged,
                                         currentPage,
                                         totalItemsCount,
                                         portionSize = 10,
                                     }) => {

    const pagesCount = Math.ceil(totalItemsCount / 10)
    const pages = Array.from(Array(pagesCount).keys()).map(x => ++x)

    const portionCount = Math.ceil(pagesCount / portionSize)
    const [portionNumber, setPortionNumber] = useState(1)
    const leftPortionPageNumber = (portionNumber - 1) * portionSize + 1
    const rightPortionPageNumber = portionNumber * portionSize

    return (
        <>
            {
                totalItemsCount >= portionSize &&
                <div className={s.paginator}>
                    <div>
                        {portionNumber > 1 &&
                            <button onClick={() => setPortionNumber(portionNumber - 1)}>{'<'}</button>}
                        {
                            pages
                                .filter(p => p >= leftPortionPageNumber && p <= rightPortionPageNumber)
                                .map(p => {
                                    const currentPageClassName = currentPage === p ? s.selectedPage : ''
                                    const pagesNumbersClassName = `${currentPageClassName} ${s.pagesNumbers}`

                                    return (
                                        <span key={p}
                                              onClick={() => onPageChanged(p)}
                                              className={pagesNumbersClassName}>{p + ' '}
                                        </span>
                                    )
                                })
                        }
                        {
                            portionCount > portionNumber &&
                            <button onClick={() => setPortionNumber(portionNumber + 1)}>
                                {'>'}
                            </button>
                        }
                    </div>
                </div>
            }
        </>
    )
})
