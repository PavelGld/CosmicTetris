import { Tetromino } from '@/game/tetrominos';
import Cell from './Cell';

interface NextPieceProps {
  tetromino: Tetromino | undefined;
}

const NextPiece: React.FC<NextPieceProps> = ({ tetromino }) => {
  if (!tetromino || !tetromino.shape) {
    return <div className="flex justify-center items-center h-20">Loading...</div>;
  }
  
  // Create a grid to display the tetromino
  const grid = [];
  
  for (let y = 0; y < tetromino.shape.length; y++) {
    const row = [];
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x] !== 0) {
        row.push(
          <div key={`${y}-${x}`} style={{ width: '20px', height: '20px' }}>
            <Cell type={tetromino.color} />
          </div>
        );
      } else {
        row.push(
          <div key={`${y}-${x}`} style={{ width: '20px', height: '20px' }}>
            <Cell type={0} />
          </div>
        );
      }
    }
    grid.push(
      <div key={`row-${y}`} className="flex">
        {row}
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center">
      <div>{grid}</div>
    </div>
  );
};

export default NextPiece;
