import React, { useEffect, useRef, useState } from 'react';

function ChessBoard() {
  const canvasRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [currentTurn, setCurrentTurn] = useState('red');
  const [validMoves, setValidMoves] = useState([]);
  const [pieces, setPieces] = useState(() => {
    const initialPieces = [];

    const addPiece = (col, row, color, text) => {
      initialPieces.push({ col, row, color, text });
    };

    // Quân đỏ
    addPiece(0, 9, 'red', '車');
    addPiece(1, 9, 'red', '馬');
    addPiece(2, 9, 'red', '相');
    addPiece(3, 9, 'red', '仕');
    addPiece(4, 9, 'red', '帥');
    addPiece(5, 9, 'red', '仕');
    addPiece(6, 9, 'red', '相');
    addPiece(7, 9, 'red', '馬');
    addPiece(8, 9, 'red', '車');
    addPiece(1, 7, 'red', '炮');
    addPiece(7, 7, 'red', '炮');
    for (let i = 0; i < 9; i += 2) addPiece(i, 6, 'red', '兵');

    // Quân đen
    addPiece(0, 0, 'black', '車');
    addPiece(1, 0, 'black', '馬');
    addPiece(2, 0, 'black', '象');
    addPiece(3, 0, 'black', '士');
    addPiece(4, 0, 'black', '將');
    addPiece(5, 0, 'black', '士');
    addPiece(6, 0, 'black', '象');
    addPiece(7, 0, 'black', '馬');
    addPiece(8, 0, 'black', '車');
    addPiece(1, 2, 'black', '炮');
    addPiece(7, 2, 'black', '炮');
    for (let i = 0; i < 9; i += 2) addPiece(i, 3, 'black', '卒');

    return initialPieces;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const rows = 10;
    const cols = 9;
    const cellWidth = (width - 2 * padding) / (cols - 1);
    const cellHeight = (height - 2 * padding) / (rows - 1);

    // Vẽ nền
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#fceabb');
    gradient.addColorStop(1, '#f8b500');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;

    // Vẽ lưới
    for (let i = 0; i < rows; i++) {
      ctx.beginPath();
      ctx.moveTo(padding, padding + i * cellHeight);
      ctx.lineTo(width - padding, padding + i * cellHeight);
      ctx.stroke();
    }

    for (let i = 0; i < cols; i++) {
      ctx.beginPath();
      ctx.moveTo(padding + i * cellWidth, padding);
      if (i === 0 || i === cols - 1) {
        ctx.lineTo(padding + i * cellWidth, height - padding);
      } else {
        ctx.lineTo(padding + i * cellWidth, padding + 4 * cellHeight);
        ctx.moveTo(padding + i * cellWidth, padding + 5 * cellHeight);
        ctx.lineTo(padding + i * cellWidth, height - padding);
      }
      ctx.stroke();
    }

    // Vẽ sông
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.fillText('楚河', width / 4, height / 2 - 10);
    ctx.fillText('汉界', (3 * width) / 4, height / 2 - 10);

    // Vẽ điểm đánh dấu
    ctx.fillStyle = '#222';
    const markPoint = (col, row) => {
      const radius = 4;
      const x = padding + col * cellWidth;
      const y = padding + row * cellHeight;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const points = [
      [1, 2], [7, 2], [1, 7], [7, 7],
      [0, 3], [2, 3], [4, 3], [6, 3], [8, 3],
      [0, 6], [2, 6], [4, 6], [6, 6], [8, 6],
    ];

    points.forEach(([col, row]) => markPoint(col, row));

    // Highlight nước đi hợp lệ
    validMoves.forEach(({ col, row }) => {
      const x = padding + col * cellWidth;
      const y = padding + row * cellHeight;
      const radius = Math.min(cellWidth, cellHeight) / 4;
      ctx.strokeStyle = 'gold';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Highlight quân đang chọn
    if (selected) {
      const { col, row } = selected;
      const x = padding + col * cellWidth;
      const y = padding + row * cellHeight;
      const radius = Math.min(cellWidth, cellHeight) / 2 - 3;
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Vẽ quân cờ
    const drawPiece = ({ col, row, color, text }) => {
      const x = padding + col * cellWidth;
      const y = padding + row * cellHeight;
      const radius = Math.min(cellWidth, cellHeight) / 2 - 6;

      ctx.fillStyle = color === 'red' ? '#faa' : '#eee';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = color === 'red' ? '#a00' : '#333';
      ctx.font = 'bold 22px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y);
    };

    pieces.forEach(drawPiece);

  }, [pieces, selected, validMoves]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const cellWidth = (width - 2 * padding) / 8;
    const cellHeight = (height - 2 * padding) / 9;

    const col = Math.round((x - padding) / cellWidth);
    const row = Math.round((y - padding) / cellHeight);

    const clickedPiece = pieces.find(p => p.col === col && p.row === row);
    const isValidMove = validMoves.some(move => move.col === col && move.row === row);

    if (selected && isValidMove) {
      setPieces(prev =>
        prev
          .filter(p => !(p.col === col && p.row === row && p.color !== selected.color))
          .map(p =>
            p === selected
              ? { ...p, col, row }
              : p
          )
      );
      setSelected(null);
      setValidMoves([]);
      setCurrentTurn(currentTurn === 'red' ? 'black' : 'red');
    } else if (clickedPiece && clickedPiece.color === currentTurn) {
      setSelected(clickedPiece);
      // Gợi ý nước đi (tạm thời: tất cả ô trống + quân đối phương)
      const moves = [];
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 9; c++) {
          const occupied = pieces.find(p => p.col === c && p.row === r && p.color === currentTurn);
          if (!occupied) {
            moves.push({ col: c, row: r });
          }
        }
      }
      setValidMoves(moves);
    } else {
      setSelected(null);
      setValidMoves([]);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Lượt chơi: {currentTurn === 'red' ? 'Đỏ' : 'Đen'}</h2>
      <canvas ref={canvasRef} width={600} height={660} onClick={handleClick} />
    </div>
  );
}

export default ChessBoard;
