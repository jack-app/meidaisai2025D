import component from "./component";
import const_view_index from "./const_view_index";
import explanation_scene from "./explanation_scene";
import functions from "./functions";
import game_scene from "./game_scene";
import { SourceCode } from "./problems";
import problems_program from "./problems_program";
import scene_manager from "./scene_manager";
import title_scene from "./title_scene";
import user_data from "./user_data";

const SourceCodeInstances: SourceCode[] = [
  ...const_view_index,
  ...title_scene,
  ...game_scene,
  ...scene_manager,
  ...explanation_scene,
  ...problems_program,
  ...user_data,
  ...component,
  ...functions,
]

export default SourceCodeInstances;