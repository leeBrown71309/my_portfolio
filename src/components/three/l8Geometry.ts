import * as THREE from "three";

/**
 * Procedural geometry for the "L8" brand monogram (LEEEIGHT.).
 *
 * The mark is an oblique/italic "L" rendered as a flat beveled ribbon,
 * followed by an "8" swept as a single continuous tube along a figure-eight
 * path: two round loops (the bottom slightly larger than the top) joined by
 * two connectors that cross at the waist and bow in opposite Z directions,
 * so the tube weaves over/under itself — matching the reference.
 *
 * All builders emit geometry in a shared "monogram-local" space; the whole
 * set is sheared (italic) and re-centered on the origin before being
 * returned, so callers can drop the meshes straight into a group.
 */

// --- Tunable parameters (monogram-local units) --------------------------
const ITALIC_SHEAR = 0.24; // lean-right skew applied as x += k * y

// "L" — flat beveled ribbon
const RIBBON_DEPTH = 0.3; // extrusion depth (Z thickness)
const STROKE = 0.31; // stroke width of the ribbon
const L_HEIGHT = 2.46; // total height of the vertical stroke
const L_FOOT = 1.02; // length of the horizontal foot
const L_BOTTOM_Y = -0.86; // baseline of the "L"

// "8" — single figure-eight tube. The loops stop just short of the center
// so that only the two crossover connectors meet at the waist.
const TUBE = 0.19; // tube radius
const R_TOP = 0.5; // radius of the top loop
const R_BOT = 0.56; // radius of the bottom loop (slightly larger)
const CY_TOP = 0.66; // top loop center Y (bottom of loop sits just above waist)
const CY_BOT = -0.72; // bottom loop center Y (top of loop sits just below waist)
const GAP_DEG = 36; // angular gap at each loop where the connectors attach
const WEAVE_Z = 0.17; // how far the crossover connectors bow in ±Z
const EIGHT_CX = 1.3; // horizontal placement of the "8"
const EIGHT_CY = 0.4; // vertical placement of the "8"
// ------------------------------------------------------------------------

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Skew matrix: x' = x + k * y (italic lean). */
function shearMatrix(k: number): THREE.Matrix4 {
  // prettier-ignore
  return new THREE.Matrix4().set(
    1, k, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  );
}

/** Extruded block "L" with a horizontal foot, centered on Z. */
function buildLetterL(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(L_FOOT, 0);
  shape.lineTo(L_FOOT, STROKE);
  shape.lineTo(STROKE, STROKE);
  shape.lineTo(STROKE, L_HEIGHT);
  shape.lineTo(0, L_HEIGHT);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: RIBBON_DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2,
  });
  geo.translate(0, L_BOTTOM_Y, -RIBBON_DEPTH / 2);
  return geo;
}

/** A point on a loop circle. */
function loopPoint(radius: number, centerY: number, deg: number): THREE.Vector3 {
  const a = rad(deg);
  return new THREE.Vector3(radius * Math.cos(a), centerY + radius * Math.sin(a), 0);
}

/** Interior points of a crossover connector that bows in Z for the weave. */
function connector(from: THREE.Vector3, to: THREE.Vector3, zAmp: number, steps: number): THREE.Vector3[] {
  const out: THREE.Vector3[] = [];
  for (let i = 1; i < steps; i++) {
    const s = i / steps;
    out.push(
      new THREE.Vector3(
        THREE.MathUtils.lerp(from.x, to.x, s),
        THREE.MathUtils.lerp(from.y, to.y, s),
        zAmp * Math.sin(Math.PI * s),
      ),
    );
  }
  return out;
}

/** Single continuous tube tracing the figure-eight "8". */
function buildFigureEight(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const half = GAP_DEG / 2;

  // Top loop, traced CCW from lower-right to lower-left (gap at the bottom).
  const topStart = 270 + half; // lower-right
  const topEnd = 270 + 360 - half; // lower-left (+360)
  for (let d = topStart; d <= topEnd + 1e-6; d += 5) {
    points.push(loopPoint(R_TOP, CY_TOP, d));
  }

  // Connector: top lower-left -> bottom upper-right (bows +Z).
  const topLeft = loopPoint(R_TOP, CY_TOP, topEnd);
  const botUpperRight = loopPoint(R_BOT, CY_BOT, 90 - half);
  points.push(...connector(topLeft, botUpperRight, +WEAVE_Z, 7));

  // Bottom loop, traced CW from upper-right to upper-left (gap at the top).
  const botStart = 90 - half; // upper-right
  const botEnd = 90 - 360 + half; // upper-left (-360)
  for (let d = botStart; d >= botEnd - 1e-6; d -= 5) {
    points.push(loopPoint(R_BOT, CY_BOT, d));
  }

  // Connector: bottom upper-left -> top lower-right (bows -Z, closes the loop).
  const botLeft = loopPoint(R_BOT, CY_BOT, botEnd);
  const topRight = loopPoint(R_TOP, CY_TOP, topStart);
  points.push(...connector(botLeft, topRight, -WEAVE_Z, 7));

  const curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.5);
  const geo = new THREE.TubeGeometry(curve, 520, TUBE, 20, true);
  geo.translate(EIGHT_CX, EIGHT_CY, 0);
  return geo;
}

/**
 * Build the monogram parts, italic-sheared and centered on the origin.
 * Returned in draw order: [letter "L", figure-eight "8"].
 */
export function createL8Geometries(): THREE.BufferGeometry[] {
  const geometries = [buildLetterL(), buildFigureEight()];

  const shear = shearMatrix(ITALIC_SHEAR);
  geometries.forEach((geo) => geo.applyMatrix4(shear));

  const bounds = new THREE.Box3();
  geometries.forEach((geo) => {
    geo.computeBoundingBox();
    if (geo.boundingBox) bounds.union(geo.boundingBox);
  });
  const center = new THREE.Vector3();
  bounds.getCenter(center);
  geometries.forEach((geo) => geo.translate(-center.x, -center.y, -center.z));

  return geometries;
}
