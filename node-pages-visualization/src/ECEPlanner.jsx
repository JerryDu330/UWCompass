import ProgramPlanner from './ProgramPlanner';
import { ECE_PROGRAM_CONFIG } from './eceData';

export default function ECEPlanner() {
  return <ProgramPlanner config={ECE_PROGRAM_CONFIG} />;
}
