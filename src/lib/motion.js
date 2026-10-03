// Mutable, render-free motion flag shared between the Motion toggle (DOM)
// and every animated 3D component. Mutating it never triggers a React re-render.
export const motion = { on: true }
