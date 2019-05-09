
class Tile {
    constructor(minTileSpace) {

        let spacing = random(350, minTileSpace);
        let centerx = random(spacing, width - spacing);

        this.centerx = centerx;



        this.y = 0;
        this.h = 20;


        this.left = centerx - (spacing / 2);
        this.right = this.left + spacing;




    }

    hits(player) {
        return ((this.y + this.h) > (player.y - player.r) && (player.x < (this.left + player.r) || player.x > (this.right - player.r)));
    }

    show() {
        stroke(255);
        fill(200);

        rect(0, this.y, this.left, this.h);
        rect(this.right, this.y, width - this.right, this.h);
    }


    update() {
        this.y += 1;
    }

    // Has it moved offscreen?
    offscreen() {
        return this.y > height;
    }
}