import React, { Component } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as Helpers from '../helpers/FileHelpers';


export default class FishScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: true
        };
    }

    componentDidMount() {
        this.fetchData(true);
    }

    fetchData = (useCached) => {
        return new Promise((resolve, reject) => {

            this.setState({loading: true});

            Helpers.getJsonFileContents(useCached, 'fish').then(fishList => {

                this.setState({
                    loading: false,
                    dataSource: fishList,
                });

                resolve(true);

            }).catch(error => {
                console.log('getJsonFileContents catch', error);
                this.setState({loading: false});

                resolve(false);
            });
        });
    };

    onRefresh() {
        console.log('onRefresh');

        const originalProductList = this.state.dataSource;

        this.fetchData(false).then(success => {
            console.log('Refreshed data');
        }).catch(error => {
            console.log('fetchData catch', error);
            this.setState({
                dataSource: originalProductList,
            });
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <Button title="Refresh" onPress={() => this.onRefresh()} />
                </View>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={({ item }) => <Text style={styles.item}>{item.Name}</Text>}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
