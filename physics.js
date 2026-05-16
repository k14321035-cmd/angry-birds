/**
 * Angry Birds Game - Physics Engine
 * Handles collisions, gravity, and object motion
 */

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    divide(scalar) {
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    cross(other) {
        return this.x * other.y - this.y * other.x;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const len = this.length();
        if (len === 0) return new Vector2(0, 0);
        return this.divide(len);
    }

    static zero() {
        return new Vector2(0, 0);
    }

    static right() {
        return new Vector2(1, 0);
    }

    static down() {
        return new Vector2(0, 1);
    }
}

class PhysicsBody {
    constructor(x, y, width, height, mass = 1) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);

        this.width = width;
        this.height = height;
        this.mass = mass;

        this.rotation = 0;
        this.angularVelocity = 0;

        this.friction = 0.98;
        this.restitution = 0.6;
        this.gravity = 0.3;
    }

    applyForce(force) {
        this.acceleration = force.divide(this.mass);
    }

    update() {
        // Apply gravity
        this.velocity.y += this.gravity;

        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction * 0.99;

        // Update position
        this.position = this.position.add(this.velocity);

        // Update rotation
        const angularDamping = 0.98;
        this.angularVelocity *= angularDamping;
        this.rotation += this.angularVelocity;

        // Keep rotation in bounds
        while (this.rotation > Math.PI * 2) this.rotation -= Math.PI * 2;
        while (this.rotation < 0) this.rotation += Math.PI * 2;

        // Boundary collision (ground)
        if (this.position.y + this.height > 550) {
            this.position.y = 550 - this.height;
            this.velocity.y *= -this.restitution;

            // Stop if barely moving
            if (Math.abs(this.velocity.y) < 1) {
                this.velocity.y = 0;
            }
        }

        // Boundary collision (walls)
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x *= -this.restitution;
        }
        if (this.position.x + this.width > 800) {
            this.position.x = 800 - this.width;
            this.velocity.x *= -this.restitution;
        }

        // Stop if moving very slowly
        if (this.velocity.length() < 0.1) {
            this.velocity = new Vector2(0, 0);
        }
    }

    getAABB() {
        return {
            x1: this.position.x,
            y1: this.position.y,
            x2: this.position.x + this.width,
            y2: this.position.y + this.height
        };
    }

    collidingWith(other) {
        const aabb1 = this.getAABB();
        const aabb2 = other.getAABB();

        return !(aabb1.x2 < aabb2.x1 ||
                 aabb1.x1 > aabb2.x2 ||
                 aabb1.y2 < aabb2.y1 ||
                 aabb1.y1 > aabb2.y2);
    }
}

class CollisionDetector {
    static resolveCollision(body1, body2) {
        // Get centers
        const center1 = new Vector2(
            body1.position.x + body1.width / 2,
            body1.position.y + body1.height / 2
        );

        const center2 = new Vector2(
            body2.position.x + body2.width / 2,
            body2.position.y + body2.height / 2
        );

        // Collision normal
        const normal = center2.subtract(center1).normalize();
        const relativeVelocity = body2.velocity.subtract(body1.velocity);

        // Check if moving apart
        if (relativeVelocity.dot(normal) >= 0) return;

        // Calculate impulse
        const restitution = Math.min(body1.restitution, body2.restitution);
        const velAlongNormal = relativeVelocity.dot(normal);
        const j = -(1 + restitution) * velAlongNormal / (body1.mass + body2.mass);

        const impulse = normal.multiply(j);

        // Apply impulse
        body1.velocity = body1.velocity.subtract(impulse.multiply(body1.mass));
        body2.velocity = body2.velocity.add(impulse.multiply(body2.mass));

        // Apply angular impulse
        const r1 = new Vector2(body1.width / 2, body1.height / 2);
        const r2 = new Vector2(body2.width / 2, body2.height / 2);

        const angularImpulse1 = r1.cross(impulse.multiply(-body1.mass)) / (body1.mass * 100);
        const angularImpulse2 = r2.cross(impulse.multiply(body2.mass)) / (body2.mass * 100);

        body1.angularVelocity += angularImpulse1;
        body2.angularVelocity += angularImpulse2;

        // Separate objects
        const overlap = (body1.width / 2 + body2.width / 2) - 
                       Math.abs(center1.x - center2.x);

        if (overlap > 0) {
            const separation = normal.multiply(overlap / 2 + 0.5);
            body1.position = body1.position.subtract(separation);
            body2.position = body2.position.add(separation);
        }
    }

    static getCollisionDepth(body1, body2) {
        const aabb1 = body1.getAABB();
        const aabb2 = body2.getAABB();

        const overlapX = Math.min(aabb1.x2, aabb2.x2) - Math.max(aabb1.x1, aabb2.x1);
        const overlapY = Math.min(aabb1.y2, aabb2.y2) - Math.max(aabb1.y1, aabb2.y1);

        return Math.min(overlapX, overlapY);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Vector2, PhysicsBody, CollisionDetector };
}
