import { Component } from '@angular/core';
import { injectReconnect } from 'ngx-wagmi';
import { ConnectButtonComponent } from '../components/connect-button/connect-button.component';

@Component({
  standalone: true,
  template: `
    <div class="p-4">
      <app-connect-button />
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus quibusdam nemo fugiat! Beatae modi fuga magnam
      excepturi perferendis ut quasi suscipit harum, dicta odio distinctio expedita illum eligendi at non placeat
      incidunt corporis ea ad ex quas adipisci quod! Fuga nesciunt, tenetur perferendis asperiores autem doloremque
      optio accusamus aliquid maxime explicabo exercitationem, nobis ullam molestiae? Laboriosam eligendi, voluptatem
      dolorem laudantium cupiditate beatae aliquid delectus doloremque accusamus officia rem saepe natus quis distinctio
      vel hic veniam optio maxime harum magni molestiae dicta? Maxime, ipsam quo. Repudiandae modi laborum voluptas a
      voluptates, eveniet fuga sit veniam tempora perspiciatis aperiam vero debitis repellendus ratione dolorem ipsam
      doloremque suscipit error quaerat eligendi facere quam consequatur ab. Fugiat saepe provident, quidem amet
      explicabo sed? Vero quo quis adipisci impedit velit consequuntur delectus, rerum iste doloribus aperiam eum
      voluptate saepe maiores quasi, repudiandae in animi voluptatibus? Nemo corporis impedit error nisi dolores quasi
      alias sit vero adipisci neque cumque dolorem autem iure odio est, magni deserunt veniam animi! A doloribus facilis
      magnam necessitatibus. Obcaecati velit modi tempora facilis nobis fugiat est id doloremque eum! Quibusdam
      architecto, cumque possimus corrupti praesentium nulla modi, sapiente voluptatem cum ducimus eligendi? Neque,
      cupiditate accusantium cumque voluptate quibusdam incidunt nostrum blanditiis?
    </div>
  `,
  imports: [ConnectButtonComponent],
})
export default class SeedkitPage {
  reconnectM = injectReconnect();

  constructor() {
    this.reconnectM.reconnect();
  }
}
