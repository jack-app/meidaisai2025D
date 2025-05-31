import { describe, it, expect } from 'vitest';
import { SourceCode } from './problems';
import SourceCodeInstances from './instances';

describe('Problems', () => {
    it('0 not in [9]', () => {
        expect(!(0 in [9]));
    })
    it('should have at least one problem instance', () => {
        expect(SourceCodeInstances.length).toBeGreaterThan(0);
    });
    it('should produce problem', () => {
        for (const src of SourceCodeInstances) {
            expect(src).toBeDefined();
            expect(src.generateProblem()).toBeDefined();
        }
    });
    it('should not produce letters in order', () => {
        const src = new SourceCode(
            "sample",
            `console.log("Hello,World!");`,
            "typescript"
        );
        const problem = src.generateProblem();
        for (const c of `console.log("Hello,World!");`) {
            if (c !== " ") {
                expect(problem.charAtCursor()).toBe(c);
                problem.proceed();
            }
        }
    })
    it('should not produce comment', () => {
        const srctext = 
`console.log("Hello, World!");
// This is a comment
function test() {}`
        const src = new SourceCode(
            "sample",
            srctext,
            "typescript"
        );

        const expectedText = 
`console.log("Hello, World!");
function test() {}`
        const problem = src.generateProblem();
        for (const c of expectedText) {
            if (c !== " " && c !== "\n") {
                expect(problem.charAtCursor()).toBe(c);
                problem.proceed();
            }
        }
    })
    it('jsx should be tokenize', () => {
        const srctext =
`import { createSignal, Show } from 'solid-js'
import FixedAspectRatio from './components/fixedAspectRatio'

import type SceneBase from './scenes/fundation/sceneBase'

import LoadingScene from './scenes/loading'
import instanciateAllScenes from './scenes/fundation/instanciate'
import SceneSig from './scenes/fundation/signatures'
import { sceneManager } from './const'

function ViewRoot() {
  const loadingScene = new LoadingScene(sceneManager)
  instanciateAllScenes(sceneManager)

  const [getScene, setScene] = createSignal<SceneBase>();
  sceneManager.bindSceneChangeCallback(setScene);

  return (
    <FixedAspectRatio width={1600} height={900}>
      <Show 
        when={getScene()} 
        fallback={loadingScene.makeComponent()}
      >
          {getScene()!.makeComponent()}
      </Show>
    </FixedAspectRatio>
  )
}

export default ViewRoot`
        const src = new SourceCode(
            "sample",
            srctext,
            "typescript"
        );

        const problem = src.generateProblem();
        
        for (const c of srctext) {
            if (c !== " " && c !== "\n") {
                expect(problem.charAtCursor()).toBe(c);
                problem.proceed();
            }
        }
    });
});