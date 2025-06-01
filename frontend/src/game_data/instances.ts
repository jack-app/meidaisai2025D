import const_view_index from "./const_view_index";
import game_scene from "./game_scene";
import { SourceCode } from "./problems";
import title_scene from "./title_scene";

const SourceCodeInstances: SourceCode[] = [
  ...const_view_index,
  ...title_scene,
  ...game_scene,
]

export default SourceCodeInstances;