import {Component} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Subscription} from 'rxjs';
import gql from 'graphql-tag';
import {Sentence} from "../../models/sentence";
import { ToastController } from '@ionic/angular';

const getAllSentencesByUsername = gql`
    query sentencesByUsername($username: String!){sentencesByUsername(username: $username){id, username, sentence, createdAt}}
`;

const removeSentence = gql`
    mutation removeSentence($id: ID!){
        removeSentence(id: $id)
    }
`;

const createSentenceQuery = gql`    
    mutation createSentence($username: String!, $sentence: String!){
        createSentence(username: $username, sentence: $sentence) {
            id,
            username,
            sentence,
            createdAt,
        }
    }
`;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  sentenceList: Array<Sentence>;
  username: string;
  private querySubscription: Subscription;

  constructor(private apollo: Apollo, public toastController: ToastController) {}

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  createSentence(form){
      const sentence = form?.form?.value?.sentence;
      if(!sentence || !this.username) return;

      this.apollo.mutate({
          mutation: createSentenceQuery,
          variables: {
              username: this.username,
              sentence,
          }
      }).subscribe(({ data: { createSentence } }: { data: { createSentence} }) => {
          if(this.sentenceList) {
              this.sentenceList = [...this.sentenceList, createSentence];
          } else {
              this.sentenceList = [createSentence];
          }
      },() => {
          this.presentToast('Creating sentence failed');
      });
  }

  setUsername(form){
      console.log('form', form);
      this.username = form?.form?.value?.name;
      console.log('this.username', this.username);
      if(this.username){
          this.getAllSentences();
      }
  }

  getAllSentences(){
      this.querySubscription = this.apollo.watchQuery<any>({
          query: getAllSentencesByUsername,
          variables: {
              username: this.username,
          }
      })
          .valueChanges
          .subscribe(({ data: { sentencesByUsername }, loading }: { data: { sentencesByUsername }, loading: boolean}) => {
              console.log('getAllSentences', sentencesByUsername);
              this.sentenceList = sentencesByUsername;
          }, () => {
              this.presentToast('Fetching data failed');
          });
  }

  onRemove(id){
      this.apollo.mutate({
          mutation: removeSentence,
          variables: {
              id
          }
      }).subscribe(({ data: { removeSentence } }: { data: { removeSentence }}) => {
          if(removeSentence){
              this.sentenceList = this.sentenceList.filter(sentence => sentence.id !== id);
          }
      },(error) => {
          this.presentToast('Remove failed');
      });
  }

    async presentToast(message, color = "danger") {
        const toast = await this.toastController.create({
            message,
            color,
            duration: 2000
        });
        toast.present();
    }
}
