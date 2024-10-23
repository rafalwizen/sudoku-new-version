import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import styles from './Sudoku.module.styl'

const initialBoard = [
    [6, 0, 0, 0, 0, 5, 3, 0, 0],
    [0, 8, 1, 0, 2, 0, 0, 4, 0],
    [4, 5, 0, 1, 6, 0, 7, 0, 0],
    [2, 0, 8, 6, 5, 3, 0, 0, 0],
    [0, 7, 3, 2, 4, 0, 5, 0, 0],
    [1, 4, 0, 0, 0, 9, 0, 0, 0],
    [0, 0, 7, 0, 0, 0, 6, 0, 0],
    [9, 0, 6, 4, 7, 2, 8, 1, 0],
    [0, 0, 4, 0, 1, 0, 3, 5, 0]
]

function Sudoku() {
    const [board, setBoard] = useState(initialBoard.map(row =>
        row.map(cell => ({ value: cell, isInitial: cell !== 0 }))
    ))
    const [selectedCell, setSelectedCell] = useState(null)
    const [mistakes, setMistakes] = useState(0)
    const [timer, setTimer] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const handleCellClick = (row, col) => {
        if (!board[row][col].isInitial) {
            setSelectedCell({ row, col })
        }
    }

    const handleNumberInput = (number) => {
        if (selectedCell) {
            const { row, col } = selectedCell
            if (!board[row][col].isInitial) {
                const newBoard = [...board]
                newBoard[row][col] = { ...newBoard[row][col], value: number }
                setBoard(newBoard)
            }
        }
    }

    const handleErase = () => {
        if (selectedCell) {
            const { row, col } = selectedCell
            if (!board[row][col].isInitial) {
                const newBoard = [...board]
                newBoard[row][col] = { ...newBoard[row][col], value: 0 }
                setBoard(newBoard)
            }
        }
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const isHighlighted = (row, col) => {
        if (!selectedCell) return false
        const { row: selectedRow, col: selectedCol } = selectedCell
        return row === selectedRow ||
            col === selectedCol ||
            (Math.floor(row / 3) === Math.floor(selectedRow / 3) &&
                Math.floor(col / 3) === Math.floor(selectedCol / 3))
    }

    return (
        <div className={styles.container}>
            <div className={styles.gameInfo}>
                <div>Difficulty: Easy</div>
                <div>Mistakes: {mistakes}/3</div>
                <div>Score: 0</div>
                <div>{formatTime(timer)}</div>
            </div>
            <div className={styles.board}>
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`${styles.cell} 
                ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? styles.selected : ''}
                ${isHighlighted(rowIndex, colIndex) ? styles.highlighted : ''}
                ${cell.value === 0 ? styles.empty : styles.filled}
                ${cell.isInitial ? styles.initial : styles.userInput}
                ${colIndex % 3 === 2 && colIndex !== 8 ? styles.rightBorder : ''}
                ${rowIndex % 3 === 2 && rowIndex !== 8 ? styles.bottomBorder : ''}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                            {cell.value !== 0 ? cell.value : ''}
                        </div>
                    ))
                )}
            </div>
            <div className={styles.actions}>
                <Button variant="outline" className={styles.actionButton}>
                    Undo
                </Button>
                <Button
                    variant="outline"
                    className={styles.actionButton}
                    onClick={handleErase}
                >
                    Erase
                </Button>
                <Button variant="outline" className={styles.actionButton}>
                    Notes
                </Button>
                <Button variant="outline" className={styles.actionButton}>
                    Hint
                </Button>
            </div>
            <div className={styles.numbers}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                    <Button
                        key={number}
                        variant="outline"
                        className={styles.numberButton}
                        onClick={() => handleNumberInput(number)}
                    >
                        {number}
                    </Button>
                ))}
            </div>
            <Button className={styles.newGameButton}>New Game</Button>
        </div>
    )
}

export default Sudoku